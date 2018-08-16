import React, {Component} from 'react';

import NotificationSystem from 'react-notification-system';

import _ from 'lodash';

import PropTypes from 'prop-types';

import ApiCall from '../../services/api-call'
import {entitySearchType, entityItemType, entityCreateType, entityCloneType, entityBulkEdit} from '../../types/entity-types'
import {componentRequire} from '../../utils/require-util';

let EntitiesNavigation = componentRequire('app/components/entities-navigation/entities-navigation', 'entities-navigation');
let EntityWindow = componentRequire('app/components/entity-window/entity-window', 'entity-window');

export default class MainView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      markupData: context.markupData,
      entityMarkupData: context.entityMarkupData,
      selectedEntity: null,
      openedEntities: [],
      snackbarOpen: false,
      snackbarMessage: ''
    };
    this.searchEntityWindowReferences = [];
    this.createWindowIncrementor = 1;
    this.notificationSystem = null;
  }

  componentWillMount() {
    return this.parseUrlEntity()
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  openNewEntity(entity) {
    let selectedEntity = {};
    if (entity.isNew) {
      selectedEntity = {
        entityId: entity.entityId,
        data: this.state.entityMarkupData[entity.entityName],
        type: entityCreateType,
        itemId: this.createWindowIncrementor,
        entityName: entity.entityName
      };
      this.createWindowIncrementor++;
    } else {
      selectedEntity = {
        entityId: entity.entityId,
        data: this.state.markupData[entity.entityId],
        type: entitySearchType,
        itemId: null
      };
    }
    this.setSelectedItemInState(selectedEntity);
  }

  getOpenedEntities(selectedEntity) {
    let openedEntities = this.state.openedEntities.map(item => {
      return {...item, isVisible: false}
    });
    let selectedEntityIndex = -1;
    if (selectedEntity.type === entityItemType) {
      selectedEntityIndex = _.findIndex(this.state.openedEntities, {itemId: selectedEntity.itemId});
    } else {
      selectedEntityIndex = _.findIndex(this.state.openedEntities, {
        entityId: selectedEntity.entityId,
        type: selectedEntity.type,
        itemId: selectedEntity.itemId
      });
    }
    if (selectedEntityIndex < 0) {
      selectedEntity.isVisible = true;
      openedEntities.push(selectedEntity);
    } else {
      let selectedEntityActual = openedEntities[selectedEntityIndex];
      selectedEntityActual.isVisible = true;
      if (selectedEntity.type === entitySearchType) {
        selectedEntityActual.additionParams = selectedEntity.additionParams;
      }
      openedEntities.splice(selectedEntityIndex, 1);
      openedEntities.push(selectedEntityActual);
    }

    return openedEntities;
  }

  onNavigationItemClick(selectedEntity) {
    this.setSelectedItemInState(selectedEntity);
  }

  setSelectedItemInState(selectedEntity) {
    this.addHashUrlForSelectedEntity(selectedEntity);
    this.setState({
      ...this.state,
      selectedEntity: selectedEntity,
      openedEntities: this.getOpenedEntities(selectedEntity)
    });
  }

  onEntityItemClick(entityItem, entityId, url, itemType, additionParams) {
    let selectedEntity = {};

    if (itemType && itemType === entitySearchType) {
      selectedEntity = {
        entityId: entityId,
        data: this.state.markupData[entityId],
        type: entitySearchType,
        itemId: null,
        additionParams: additionParams
      };
    } else if (itemType && (itemType === entityCloneType || itemType === entityBulkEdit)) {
      selectedEntity = {
        entityId: entityId,
        data: this.state.entityMarkupData[entityItem.entityName],
        type: itemType,
        itemId: this.createWindowIncrementor,
        entityName: entityItem.entityName,
        additionParams: additionParams
      };
      console.log(additionParams);
      this.createWindowIncrementor++;
    } else {
      selectedEntity = {
        entityId: entityId,
        data: this.state.entityMarkupData[entityItem.entityName],
        type: entityItemType,
        itemId: entityItem.id,
        entityName: entityItem.entityName,
        entityUrl: url,
        entityCode: entityItem.code
      };
    }

    this.setSelectedItemInState(selectedEntity);
  }

  onEntityWindowClose(entity) {
    let entityToCloseIndex = _.findIndex(this.state.openedEntities, {entityId: entity.entityId, type: entity.type, itemId: entity.itemId});
    let openedEntities = _.cloneDeep(this.state.openedEntities);
    openedEntities.splice(entityToCloseIndex, 1);
    let lastIndex = openedEntities.length - 1;
    let selectedEntity = entity.isVisible ? null : this.state.selectedEntity;
    if (lastIndex > -1 && entity.isVisible) {
      openedEntities[lastIndex].isVisible = true;
      selectedEntity = openedEntities[lastIndex];
    }
    this.addHashUrlForSelectedEntity(selectedEntity);
    this.setState({
      ...this.state,
      selectedEntity: selectedEntity,
      openedEntities: openedEntities
    });
  }

  updateCreatedEntity(entity, itemId, code) {
    let createEntityWindowIndex = _.findIndex(this.state.openedEntities, {entityId: entity.entityId, type: entity.type, itemId: entity.itemId});
    let openedEntities = _.cloneDeep(this.state.openedEntities);
    openedEntities[createEntityWindowIndex].type = entityItemType;
    openedEntities[createEntityWindowIndex].itemId = itemId;
    openedEntities[createEntityWindowIndex].entityCode = code;
    this.addHashUrlForSelectedEntity(openedEntities[createEntityWindowIndex]);
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

  updateNavigationCode(entity, code) {
    if (entity.type !== entityItemType) {
      return;
    }

    let entityIndex = _.findIndex(this.state.openedEntities, {itemId: entity.itemId});
    let openedEntities = _.cloneDeep(this.state.openedEntities);
    openedEntities[entityIndex].entityCode = code;
    this.setState({...this.state, openedEntities: openedEntities});
  }

  render() {
    return (
      <div>
        <EntitiesNavigation onNavigationItemClick={this.onNavigationItemClick.bind(this)} onEntityWindowClose={this.onEntityWindowClose.bind(this)}
                            entities={this.state.openedEntities}/>
        {this.renderOpenedEntities()}
        <NotificationSystem ref="notificationSystem"/>
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
                                       openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}
                                       updateNavigationCode={this.updateNavigationCode.bind(this)}
                                       ref={item => item && entity.type === entitySearchType && this.searchEntityWindowReferences.push({
                                         entity: entity,
                                         refItem: item
                                       })}
                                       onEntityWindowClose={this.onEntityWindowClose.bind(this)}
                                       onUpdateEntitySearchView={this.onUpdateEntitySearchView.bind(this)}
                                       updateCreatedEntity={this.updateCreatedEntity.bind(this)}
                                       key={this.getEntityWindowKey(entity)}
                                       entity={entity}/>
    )
  }

  openNotificationSnackbar(message, level) {
    this.notificationSystem.addNotification({
      message: message,
      level: level || 'success',
      position: 'tc'
    });
  }

  addHashUrlForSelectedEntity(entity) {
    if (!entity || entity.type === entityCreateType) {
      window.location.hash = '';
      return;
    }

    window.location.hash = `type=${entity.type}&itemId=${entity.itemId || ''}&entityId=${entity.entityId}&entityName=${entity.entityName || ''}&entityUrl=${entity.entityUrl || ''}&entityCode=${entity.entityCode || ''}`;
  }

  parseUrlEntity() {
    if (!window.location.hash.indexOf('type=') < 0) {
      return Promise.reject();
    }

    let locationHash = window.location.hash.slice(1);

    let splittedHashUrl = locationHash.split('&');
    let urlEntity = {};
    splittedHashUrl.forEach(item => {
      let splitItem = item.split('=');
      urlEntity[splitItem[0]] = !!splitItem[1] ? splitItem[1] : null;
    });

    if (urlEntity.type === 'nemesisNewWidget') {
      this.setNemesisNewWidget(urlEntity.slotId);
      return Promise.resolve();
    }

    if (urlEntity.type === 'nemesisNewPage') {
      let additionParams = {
        customClientData: {catalogVersion: {catalogVersion: urlEntity.catalogCode, id: urlEntity.catalogVersionId}, masterTemplate:{id: urlEntity.templateId, code: urlEntity.templateCode, catalogVersion: urlEntity.catalogCode}}
      };
      this.onEntityItemClick({entityName: 'cms_page'}, 'cms_page', null, entityCloneType, additionParams);
      return Promise.resolve();
    }

    if (urlEntity.type === entityItemType) {
      urlEntity.data = this.state.entityMarkupData[urlEntity.entityName]
    } else if (urlEntity.type === entitySearchType) {
      urlEntity.data = this.state.markupData[urlEntity.entityId]
    } else {
      return Promise.reject();
    }

    this.setSelectedItemInState(urlEntity);
    return Promise.resolve();
  }

  setNemesisNewWidget(slotId) {
    let selectedEntity = {
      type: 'nemesisNewWidget',
      entityCode: 'nemesisNewWidget',
      entityId: 'widget',
      itemId: null,
      slotId: slotId
    };
    this.setSelectedItemInState(selectedEntity);
  }
}

MainView.contextTypes = {
  markupData: PropTypes.object,
  entityMarkupData: PropTypes.object
};