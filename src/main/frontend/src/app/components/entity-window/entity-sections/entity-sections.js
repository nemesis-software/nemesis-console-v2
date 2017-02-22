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
          <RaisedButton label='Save' />
          <RaisedButton label='Save and close' />
          <RaisedButton label='Delete' />
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
}