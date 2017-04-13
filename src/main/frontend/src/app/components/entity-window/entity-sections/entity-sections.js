import React, { Component } from 'react';

import Translate from 'react-translate-component';

import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import SwipeableViews from 'react-swipeable-views';

import _ from 'lodash';

import {entityItemType, entityCreateType} from '../../../types/entity-types';
import { nemesisFieldTypes } from '../../../types/nemesis-types'
import ApiCall from '../../../services/api-call';
import { componentRequire } from '../../../utils/require-util';

let EntitySection = componentRequire('app/components/entity-window/entity-sections/entity-section/entity-section', 'entity-section');

const keyPrefix = 'entitySection';

export default class EntitySections extends Component {
  constructor(props) {
    super(props);
    this.sectionsReferences = [];

    this.state = { sectionIndex: 0, entityData: {}, key: keyPrefix + Date.now(), openDeleteConfirmation: false, openErrorDialog: false, errorMessage: null };
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
        <Paper zDepth={1} style={{margin: '5px 0', padding: '5px'}}>
          {this.getFunctionalButtons(this.props.entity).map((button, index) => <FlatButton label={<Translate component="span" content={'main.' + button.label} fallback={button.label} />} onClick={button.onClickFunction} key={index}/>)}
        </Paper>
        <Tabs onChange={this.handleChange}
              value={this.state.sectionIndex}>
              {this.props.entity.data.sections.map((item, index) => {
                return <Tab key={index} value={index} label={<Translate component="span" content={'main.' + item.title} fallback={item.title} />} />
              })}
        </Tabs>
        <SwipeableViews
          index={this.state.sectionIndex}
          onChangeIndex={this.handleChange}
        >
          {this.props.entity.data.sections.map((item, index) => {
            return <EntitySection ref={(section) => {section && this.sectionsReferences.push(section)}}
                                  key={index} section={item}
                                  entity={this.props.entity}
                                  sectionIndex={index}
                                  entityData={this.state.entityData}
                                  onEntityItemClick={this.props.onEntityItemClick} />
          })}
        </SwipeableViews>
        {this.getDeleteConfirmationDialog()}
        {this.getErrorDialog()}
      </div>
    )
  }

  getFunctionalButtons(entity) {
    let result = [
      {label: 'Save', onClickFunction: () => this.handleSaveButtonClick(false)},
      {label: 'Save & Close', onClickFunction: () => this.handleSaveButtonClick(true)}
    ];

    if (entity.type === entityItemType) {
      result.push({label: 'Delete', onClickFunction: this.handleDeleteButtonClick.bind(this)});
      result.push({label: 'Refresh', onClickFunction: this.handleRefreshButtonClick.bind(this)});
    }

    if (entity.data.synchronizable) {
      result.push({label: 'Synchronize', onClickFunction: this.handleSynchronizeButtonClick.bind(this)})
    }

    result.push({label: 'Close', onClickFunction: () => this.props.onEntityWindowClose(this.props.entity)});

    return result;
  }

  getDataEntity(entity) {
    let relatedEntities = this.getEntityRelatedEntities(entity);
    let restUrl = entity.entityUrl || (entity.entityName + '/' + entity.itemId);
    return ApiCall.get(restUrl).then(result => {
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

  getDeleteConfirmationDialog() {
    const actions = [
      <FlatButton
        label="No"
        primary={true}
        onTouchTap={this.handleCloseDeleteConfirmation.bind(this)}
      />,
      <FlatButton
        label="Yes"
        primary={true}
        onTouchTap={this.handleConfirmationDeleteButtonClick.bind(this)}
      />,
    ];
    return (
      <Dialog
        title="Delete Entity"
        actions={actions}
        modal={true}
        open={this.state.openDeleteConfirmation}
      >
        <div>Are you sure you want to delete it?</div>
      </Dialog>
    );
  }

  getErrorDialog() {
    const actions = [
      <FlatButton
        label="ok"
        onTouchTap={this.handleCloseErrorDialog.bind(this)}
      />,
    ];
    return (
      <Dialog
        title="Something went wrong!"
        actions={actions}
        modal={true}
        open={this.state.openErrorDialog}
      >
        <div style={{color: 'red'}}>{this.state.errorMessage}</div>
      </Dialog>
    );
  }

  handleCloseErrorDialog() {
    this.setState({...this.state, openErrorDialog: false});
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

  handleConfirmationDeleteButtonClick() {
    let entity = this.props.entity;
    ApiCall.delete(entity.entityId + '/' + entity.itemId).then(() => {
      this.props.onUpdateEntitySearchView(this.props.entity);
      this.props.onEntityWindowClose(this.props.entity);
      this.props.openNotificationSnackbar('Entity successfully deleted');
    }, this.handleRequestError.bind(this))
  }

  handleDeleteButtonClick() {
    this.setState({...this.state, openDeleteConfirmation: true});
  }

  handleSynchronizeButtonClick() {
    let entity = this.props.entity;
    ApiCall.get('backend/synchronize', {entityName: entity.entityName, id: entity.itemId}).then(() => {
      this.props.openNotificationSnackbar('Entity successfully synchronized');
    }, this.handleRequestError.bind(this))
  }

  handleSaveButtonClick(windowShouldClose) {
    if (!this.isRequiredFieldValid()) {
      return;
    }

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
    let restMethod = entity.type === entityItemType ? 'patch' : 'post';
    let restUrl = entity.type === entityItemType ? `${entity.entityName}/${entity.itemId}` : entity.entityName;
    ApiCall[restMethod](entity.entityUrl || restUrl, resultObject).then((result) => {
      this.props.onUpdateEntitySearchView(this.props.entity);
      let itemId = entity.type === entityItemType ? entity.itemId : result.data.id;
      this.props.openNotificationSnackbar('Entity successfully saved');
      this.resetDirtyEntityFields();

      this.uploadMediaFile(itemId, mediaFields, windowShouldClose).then(() => {
        if (windowShouldClose) {
          this.props.onEntityWindowClose(this.props.entity);
        } else if (entity.type === entityCreateType) {
          this.props.updateCreatedEntity(entity, itemId, result.data.code);
        } else if (resultObject.code) {
          this.props.updateNavigationCode(this.props.entity, resultObject.code);
        }
      });
    }, this.handleRequestError.bind(this));
  }

  uploadMediaFile(itemId, mediaFields) {
    if (!mediaFields || mediaFields.length === 0) {
      return Promise.resolve();
    }
    let data = new FormData();
    data.append('file', mediaFields[0].value);
    return ApiCall.post('upload/media/' + itemId, data, 'multipart/form-data').then(
      () => {
        this.props.openNotificationSnackbar('File successfully uploaded');
        return Promise.resolve();
      },
      (err) => {
        this.handleRequestError(err);
        return Promise.resolve();
      });
  }

  getDirtyEntityProps() {
    let result = [];
    this.sectionsReferences.forEach(section => {
      result = result.concat(section.getDirtyValues());
    });

    return result;
  }

  isRequiredFieldValid() {
    let isValid = true;
    this.sectionsReferences.forEach(section => {
      if (!isValid) {
        return;
      }
      isValid = section.isFieldsValid();
      if (!isValid) {
        this.handleChange(section.getSectionIndex());
      }
    });

    return isValid;
  }

  resetDirtyEntityFields() {
    this.sectionsReferences.forEach(section => {
      section.resetDirtyStates();
    });
  }

  handleRequestError(err) {
    let errorMsg = (err && err.response && err.response.data && err.response.data.message) || err.message || err;
    this.setState({...this.state, errorMessage: errorMsg, openErrorDialog: true})
  }

  handleCloseDeleteConfirmation() {
    this.setState({...this.state, openDeleteConfirmation: false});
  };
}