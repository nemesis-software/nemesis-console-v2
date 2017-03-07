import React, { Component } from 'react';
import { componentRequire } from '../../../utils/require-util';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import EntitySection from './entity-section/entity-section';
import RaisedButton from 'material-ui/RaisedButton';
import { nemesisFieldTypes } from '../../../types/nemesis-types'
import ApiCall from '../../../services/api-call';
import _ from 'lodash';
import {entityItemType, entityCreateType} from '../../../types/entity-types';

const keyPrefix = 'entitySection';

export default class EntitySections extends Component {
  constructor(props) {
    super(props);
    this.sectionsReferences = [];

    this.state = { sectionIndex: 0, entityData: {}, key: keyPrefix + Date.now() };
  }

  componentWillMount() {
    if (this.props.entity.type === entityItemType) {
      this.getDataEntity(this.props.entity);
    }

    this.sectionsReferences = [];
  }

  componentWillUpdate() {
    this.sectionsReferences = [];
  }

  handleChange = (value) => {
    this.setState({
      ...this.state,
      sectionIndex: value,
    });
  };

  render() {
    return (
      <div key={this.state.key}>
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
            return <EntitySection ref={(section) => {section && this.sectionsReferences.push(section)}}
                                  key={index} section={item}
                                  entityData={this.state.entityData}
                                  onEntityItemClick={this.props.onEntityItemClick} />
          })}
        </SwipeableViews>
      </div>
    )
  }

  getFunctionalButtons(entity) {
    let result = [
      {label: 'Save', onClickFunction: () => this.handleSaveButtonClick(false)},
      {label: 'Save and close', onClickFunction: () => this.handleSaveButtonClick(true)},
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
    return ApiCall.get(entity.entityName + '/' + entity.itemId).then(result => {
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
        this.setState({...this.state, entityData: {...this.state.entityData, customClientData: relatedEntitiesResult}, key: keyPrefix + Date.now()})
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
      this.props.onUpdateEntitySearchView(this.props.entity);
      this.props.onEntityWindowClose(this.props.entity);
    }, this.handleRequestError)
  }

  handleSynchronizeButtonClick() {
    let entity = this.props.entity;
    ApiCall.get('backend/synchronize', {entityName: entity.entityName, id: entity.itemId}).then(() => {
      alert('synchronized'); //TODO: use material popup
    }, this.handleRequestError)
  }

  handleSaveButtonClick(windowShouldClose) {
    let entity = this.props.entity;
    let dirtyEntityProps = this.getDirtyEntityProps();
    let resultObject = {};
    let mediaFields = [];
    dirtyEntityProps.forEach(prop => {
      if (prop.isMedia) {
        mediaFields.push(prop);
      } else {
        resultObject[prop.name] = prop.value;
      }
    });
    console.log(entity);
    let restMethod = entity.type === entityItemType ? 'patch' : 'post';
    let restUrl = entity.type === entityItemType ? `${entity.entityName}/${entity.itemId}` : entity.entityName;
    ApiCall[restMethod](restUrl, resultObject).then((result) => {
      this.props.onUpdateEntitySearchView(this.props.entity);
      let itemId = entity.type === entityItemType ? entity.itemId : result.data.id;
      console.log('updated', result, itemId); //TODO: use material popup
      if (mediaFields.length > 0) {
        this.uploadMediaFile(itemId, mediaFields[0].value, windowShouldClose);
        return;
      }

      if (windowShouldClose) {
        this.props.onEntityWindowClose(this.props.entity);
        return;
      }

      if (entity.type === entityCreateType) {
        this.props.updateCreatedEntity(entity, itemId);
      }
    }, this.handleRequestError);
  }

  uploadMediaFile(itemId, file, windowShouldClose) {
    let data = new FormData();
    data.append('file', file);
    ApiCall.post('upload/media/' + itemId, data, 'multipart/form-data').then(
      () => {
        console.log('file uploaded');
        if (windowShouldClose) {
          this.props.onEntityWindowClose(this.props.entity);
        }
      },
      this.handleRequestError);
  }

  getDirtyEntityProps() {
    let result = [];
    this.sectionsReferences.forEach(section => {
      result = result.concat(section.getDirtyValues());
    });

    return result;
  }

  handleRequestError(err) {
    //TODO: Make error visualization
    alert('button click err');
    console.log(err);
  }
}