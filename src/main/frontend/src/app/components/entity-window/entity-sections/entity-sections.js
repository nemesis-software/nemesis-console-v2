import React, { Component } from 'react';
import { componentRequire } from '../../../utils/require-util';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import EntitySection from './entity-section/entity-section';
import RaisedButton from 'material-ui/RaisedButton';
import { nemesisFieldTypes } from '../../../types/nemesis-types'
import ApiCall from '../../../services/api-call';
import _ from 'lodash';

export default class EntitySections extends Component {
  constructor(props) {
    super(props);

    this.state = { sectionIndex: 0, entityData: {} };
  }

  componentWillMount() {
    this.getDataEntity(this.props.entity);
  }

  handleChange = (value) => {
    this.setState({
      ...this.state,
      sectionIndex: value,
    });
  };

  render() {
    return (
      <div>
        <div>
          {this.getFunctionalButtons(this.props.entity).map((button, index) => <RaisedButton label={button.label} onClick={button.onClickFunction} key={index}/>)}
        </div>
        <Tabs onChange={this.handleChange}
              value={this.state.sectionIndex}>
              {this.props.entity.data.sections.map((item, index) => {
                return <Tab key={index} value={index} label={item.title} />
              })}
        </Tabs>
        <SwipeableViews
          index={this.state.sectionIndex}
          onChangeIndex={this.handleChange}
        >
          {this.props.entity.data.sections.map((item, index) => {
            return <EntitySection key={index} section={item} entityData={this.state.entityData} />
          })}
        </SwipeableViews>
      </div>
    )
  }

  getFunctionalButtons(entity) {
    let result = [
      {label: 'Save'},
      {label: 'Save and close'},
      {label: 'Delete', onClickFunction: this.handleDeleteButtonClick.bind(this)},
      {label: 'Refresh', onClickFunction: this.handleRefreshButtonClick.bind(this)},
    ];
    if (entity.data.synchronizable) {
      result.push({label: 'Synchronize', onClickFunction: this.handleSynchronizeButtonClick.bind(this)})
    }

    result.push({label: 'Close', onClickFunction: () => this.props.onEntityWindowClose(this.props.entity)});

    return result;
  }

  getDataEntity(entity) {
    let relatedEntities = this.getEntityRelatedEntities(entity);
    ApiCall.get(entity.entityId + '/' + entity.itemId).then(result => {
      this.setState({...this.state, entityData: result.data});
      Promise.all(
        relatedEntities.map(item => ApiCall.get(result.data._links[item.name].href, {projection: 'search'})
        //TODO: Patch for return 404 for empty relation - https://github.com/nemesis-software/nemesis-platform/issues/293
          .then(result => {
            return Promise.resolve(result);
          }, err => {
            return Promise.resolve({data: null});
          }))
      ).then(result => {
        let relatedEntitiesResult = {};
        relatedEntities.forEach((item, index) => {
          let data;
          if (item.type === nemesisFieldTypes.nemesisCollectionField) {
            data = this.mapCollectionData(result[index].data);
          } else {
            data = this.mapEntityData(result[index].data);
          }

          relatedEntitiesResult[item.name] = data;
        });
        this.setState({...this.state, entityData: {...this.state.entityData, customClientData: relatedEntitiesResult}})
      })
    });
  }

  getEntityRelatedEntities(entity) {
    let result = [];
    if (!entity) {
      return result;
    }
    entity.data.sections.forEach(item => {
      item.items.forEach(subItem => {
        if ([nemesisFieldTypes.nemesisCollectionField, nemesisFieldTypes.nemesisEntityField].indexOf(subItem.xtype) > -1) {
          result.push({type: subItem.xtype, name: subItem.name.replace('entity-', '')});
        }
      })
    });

    return result;
  }

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  mapEntityData(data) {
    if (!data) {
      return null;
    }

    return data.content || data;
  }

  handleRefreshButtonClick() {
    this.getDataEntity(this.props.entity);
  }

  handleDeleteButtonClick() {
    let entity = this.props.entity;
    //TODO: add popup for asking if you want to delete this
    ApiCall.delete(entity.entityId + '/' + entity.itemId).then(() => {
      this.props.onEntityWindowClose(this.props.entity, true);
    }, this.handleRequestError)
  }

  handleSynchronizeButtonClick() {
    let entity = this.props.entity;
    ApiCall.get('backend/synchronize', {entityName: entity.entityId, id: entity.itemId}).then(() => {
      alert('synchronized'); //TODO: use material popup
    }, this.handleRequestError)
  }

  handleRequestError(err) {
    //TODO: Make error visualization
    alert('cannot delete');
    console.log(err);
  }
}