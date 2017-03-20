import React, { Component } from 'react';
import ApiCall from '../../services/api-call'
import _ from 'lodash';
import EntitiesNavigation from '../entities-navigation/entities-navigation'
import EntityWindow from '../entity-window/entity-window'
import {entitySearchType, entityItemType, entityCreateType} from '../../types/entity-types'
import { componentRequire } from '../../utils/require-util';

const styles = {
  paddingLeft: '300px',
  paddingTop: '68px',
};

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {markupData: [], entityMarkupData: [], selectedEntity: null, openedEntities: []};
    this.searchEntityWindowReferences = [];
    this.createWindowIncrementor = 1;
  }

  componentWillMount() {
    Promise.all([ApiCall.get('markup/search/all'), ApiCall.get('markup/entity/all')]).then(result => {
      this.setState({...this.state, markupData: result[0].data, entityMarkupData: result[1].data});
    })
  }

  componentWillReceiveProps(nextProps) {

    let selectedEntity = {};

    if (nextProps.selectedEntity.isNew) {
      selectedEntity = {
        entityId: nextProps.selectedEntity.entityId,
        data: this.state.entityMarkupData[nextProps.selectedEntity.entityName],
        type: entityCreateType,
        itemId: this.createWindowIncrementor,
        entityName: nextProps.selectedEntity.entityName
      };
      this.createWindowIncrementor++;
    } else {
      selectedEntity = {
        entityId: nextProps.selectedEntity.entityId,
        data: this.state.markupData[nextProps.selectedEntity.entityId],
        type: entitySearchType,
        itemId: null
      };
    }
    console.log(selectedEntity);
    this.setSelectedItemInState(selectedEntity);
  }

  getOpenedEntities(selectedEntity) {
    let openedEntities = this.state.openedEntities.map(item => {return {...item, isVisible: false}});
    let selectedEntityIndex = -1;
    if (selectedEntity.type === entityItemType) {
      selectedEntityIndex = _.findIndex(this.state.openedEntities, {itemId: selectedEntity.itemId});
    } else {
      selectedEntityIndex = _.findIndex(this.state.openedEntities, {entityId: selectedEntity.entityId, type: selectedEntity.type, itemId: selectedEntity.itemId});

    }
    if (selectedEntityIndex < 0) {
      selectedEntity.isVisible = true;
      openedEntities.push(selectedEntity);
    } else {
      openedEntities[selectedEntityIndex].isVisible = true;
    }

    return openedEntities;
  }

  onNavigationItemClick(selectedEntity) {
    this.setSelectedItemInState(selectedEntity);
  }

  setSelectedItemInState(selectedEntity) {
    this.setState({
      ...this.state,
      selectedEntity: selectedEntity,
      openedEntities: this.getOpenedEntities(selectedEntity)
    });
  }

  onEntityItemClick(entityItem, entityId) {
    let selectedEntity = {
      entityId: entityId,
      data: this.state.entityMarkupData[entityItem.entityName],
      type: entityItemType,
      itemId: entityItem.id,
      entityName: entityItem.entityName
    };

    this.setSelectedItemInState(selectedEntity);
  }

  onEntityWindowClose(entity) {
    let entityToCloseIndex = _.findIndex(this.state.openedEntities, {entityId: entity.entityId, type: entity.type, itemId: entity.itemId});
    let openedEntities = _.cloneDeep(this.state.openedEntities);
    openedEntities.splice(entityToCloseIndex, 1);
    this.setState({
      ...this.state,
      selectedEntity: null,
      openedEntities: openedEntities
    });
  }

  updateCreatedEntity(entity, itemId) {
    let createEntityWindowIndex = _.findIndex(this.state.openedEntities, {entityId: entity.entityId, type: entity.type, itemId: entity.itemId});
    let openedEntities = _.cloneDeep(this.state.openedEntities);
    openedEntities[createEntityWindowIndex].type = entityItemType;
    openedEntities[createEntityWindowIndex].itemId = itemId;
    this.setState({
      ...this.state,
      selectedEntity: openedEntities[createEntityWindowIndex],
      openedEntities: openedEntities
    });
  }

  onUpdateEntitySearchView(entity) {
    let searchIndex = _.findIndex(this.searchEntityWindowReferences, (window) => {
      return window.entity.entityId === entity.entityId;
    });
    if (searchIndex > -1) {
      this.searchEntityWindowReferences[searchIndex].refItem.retakeEntitiesViewerData();
    }
  }

  render() {
    return (
      <div style={styles}>
        <EntitiesNavigation onNavigationItemClick={this.onNavigationItemClick.bind(this)} onEntityWindowClose={this.onEntityWindowClose.bind(this)} entities={this.state.openedEntities} />
        {this.renderOpenedEntities()}
      </div>
    )
  }

  getEntityWindowKey(entity) {
    return entity.entityId + entity.type + entity.itemId;
  }

  renderOpenedEntities() {
    this.searchEntityWindowReferences = [];
    return this.state.openedEntities.map(
      (entity, index) => <EntityWindow onEntityItemClick={this.onEntityItemClick.bind(this)}
                                       ref={item => item && entity.type === entitySearchType && this.searchEntityWindowReferences.push({entity: entity, refItem: item})}
                                       onEntityWindowClose={this.onEntityWindowClose.bind(this)}
                                       onUpdateEntitySearchView={this.onUpdateEntitySearchView.bind(this)}
                                       updateCreatedEntity={this.updateCreatedEntity.bind(this)}
                                       key={this.getEntityWindowKey(entity)}
                                       entity={entity}/>
    )
  }
}