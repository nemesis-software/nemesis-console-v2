import React, { Component } from 'react';

import Translate from 'react-translate-component';

import SwipeableViews from 'react-swipeable-views';
import { Modal } from 'react-bootstrap';

import { entityItemType, entityCreateType, entityCloneType, entityBulkEdit } from '../../../types/entity-types';
import ApiCall from '../../../services/api-call';
import DataService from 'servicesDir/data-service';
import { componentRequire } from '../../../utils/require-util';
import _ from 'lodash';
import MirrorButton from "./entity-sections-buttons/mirror-button";
import DiffButton from "./entity-sections-buttons/diff-button";

let EntitySection = componentRequire('app/components/entity-window/entity-sections/entity-section/entity-section', 'entity-section');

const keyPrefix = 'entitySection';

export default class EntitySections extends Component {

  constructor(props) {
    super(props);
    this.sectionsReferences = [];

    this.state = {
      sectionIndex: 0,
      entityData: {},
      key: keyPrefix + Date.now(),
      openDeleteConfirmation: false,
      openErrorDialog: false,
      errorMessage: null,
      isDataLoading: false,
      entitySyncStatus: null,
      isUpdated: false
    };
  }

  componentDidMount() {
    if (this.props.entity.type === entityItemType) {
      this.getDataEntity(this.props.entity);
    }

    if (this.props.entity.type === entityCloneType) {
      this.setState((prevState) => ({ ...prevState, entityData: this.props.entity.additionParams }));
    }

    this.sectionsReferences = [];
  }

  UNSAFE_componentWillUpdate() {
    this.sectionsReferences = [];
  }

  handleChange = (value) => {
    this.setState((prevState) => ({
      ...prevState,
      sectionIndex: value,
    }));
  };

  render() {

    return (
      <div key={this.state.key} className={'entity-sections' + (this.state.isDataLoading ? ' on-loading' : '')}>
        {this.state.isDataLoading ? <div className="loading-screen">
          <i className="material-icons loading-icon">cached</i>
        </div> : false}
        <div className="functional-buttons-container">
          {this.props.entity.type === 'SINGLE_ITEM' ? <i className="fa fa-link rest-navigation" title="Open rest" onClick={this.openRest.bind(this)} /> : false}
          {this.getFunctionalButtons(this.props.entity).map((button, index) => {
            if (button.customRenderer) {
              return button.customRenderer(index);
            } else {
              return <div className={'functional-button nemesis-button' + (button.className ? ` ${button.className}` : '')} onClick={button.onClickFunction} key={index}><Translate component="span" content={'main.' + button.label} fallback={button.label} /></div>
            }
          })}
        </div>
        <div className="section-navigation">
          {this.props.entity.data.sections.map((item, index) => {
            return <div className={'section-navigation-item' + (this.state.sectionIndex === index ? ' active' : '')} onClick={() => this.handleChange(index)} key={index}><Translate component="span" content={'main.' + item.title} fallback={item.title} />{this.getRequiredStar(item.items)}</div>
          })}
        </div>
        <SwipeableViews
          index={this.state.sectionIndex}
          onChangeIndex={this.handleChange}
        >
          {this.props.entity.data.sections.map((item, index) => {
            return <EntitySection ref={(section) => { section && this.sectionsReferences.push(section) }}
              key={index}
              section={item}
              entity={this.props.entity}
              sectionIndex={index}
              entityData={this.state.entityData}
              onEntityItemClick={this.props.onEntityItemClick}
              enableSaveButtons={this.enableSaveButtons}
            />
          })}
        </SwipeableViews>
        {this.getDeleteConfirmationDialog()}
        {this.getErrorDialog()}
        {this.getAdditionalItem()}
      </div>
    )
  }

  getFunctionalButtons(entity) {
    let result = [
      { label: 'Save', onClickFunction: () => this.handleSaveButtonClick(false), className: this.state.isUpdated ? 'dark-button' : 'dark-button disabled-button' },
      { label: 'Save & Close', onClickFunction: () => this.handleSaveButtonClick(true), className: this.state.isUpdated ? '' : 'disabled-button' }
    ];

    if (entity.type === entityItemType) {
      result.push({ label: 'Delete', onClickFunction: this.handleDeleteButtonClick.bind(this) });
      result.push({ label: 'Refresh', onClickFunction: this.handleRefreshButtonClick.bind(this) });
      result.push({ label: 'Clone', onClickFunction: this.handleCloneButtonClick.bind(this) });
    }

    if (entity.data.synchronizable) {
      result.push({
        label: 'Synchronize', customRenderer: (index) => {
          return (
            <div className={'functional-button nemesis-button synchronize-button'} onClick={this.handleSynchronizeButtonClick.bind(this)} key={index}>
              {this.getSynchronizeDot()}
              <Translate component="span" content={'main.Synchronize'} fallback={'Synchronize'} />
            </div>
          )
        }, onClickFunction: this.handleSynchronizeButtonClick.bind(this)
      });

      if (!_.isEmpty(this.state.entityData) && this.state.entityData._links && this.state.entityData._links.mirrorSyncStates) {
        result.push({
          label: 'Get Mirror', customRenderer: (index) => {
            return <MirrorButton onMirrorEntityClick={this.onMirrorEntityClick.bind(this)} key={index} isOnline={this.state.entityData.online} mirrorLink={this.state.entityData._links.mirrorSyncStates.href} />
          }
        });
        result.push({
          label: 'Get Mirror', customRenderer: (index) => {
            return <DiffButton key={index} entityName={this.props.entity.entityName} mirrorLink={this.state.entityData._links.mirrorSyncStates.href} />
          }
        });
      }
    }

    result.push({ label: 'Close', onClickFunction: () => this.props.onEntityWindowClose(this.props.entity) });

    return result;
  }

  getSynchronizeDot() {
    if (this.state.entitySyncStatus) {
      return (
        <div className={'status-dot' + (this.state.entitySyncStatus === 'OUT_OF_SYNC' ? ' red' : ' green')}>&nbsp;</div>
      );
    }

    return false;
  }

  getDataEntity(entity) {
    this.setState((prevState) => ({ ...prevState, isDataLoading: true }));
    let relatedEntities = this.getEntityRelatedEntities(entity);
    let restUrl = entity.entityUrl || (entity.entityName + '/' + entity.itemId);
    return DataService.getEntityData(restUrl, relatedEntities).then(result => {
      let syncStatus = null;
      if (result.customClientData.syncStates && result.customClientData.syncStates.length > 0) {
        syncStatus = _.some(result.customClientData.syncStates, { stateValue: 'OUT_OF_SYNC' }) ? 'OUT_OF_SYNC' : 'COMPLETED';
      }
      this.setState((prevState) => ({ ...prevState, entityData: { ...prevState.entityData, ...result }, key: keyPrefix + Date.now(), isDataLoading: false, entitySyncStatus: syncStatus }))
    });
  }

  getDeleteConfirmationDialog() {
    return (
      <Modal show={this.state.openDeleteConfirmation} onHide={this.handleCloseErrorDialog.bind(this)} animation={false}>
        <Modal.Header>
          <Modal.Title>Delete Entity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to delete it?</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{ marginRight: '15px' }} onClick={this.handleCloseDeleteConfirmation.bind(this)}>No</button>
          <button className="nemesis-button success-button" onClick={this.handleConfirmationDeleteButtonClick.bind(this)}>Yes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  onMirrorEntityClick(id) {
    this.props.onEntityItemClick({ entityName: this.props.entity.entityName, id: id, code: this.state.entityData.code }, this.props.entity.entityId);
  }

  getErrorDialog() {
    return (
      <Modal show={this.state.openErrorDialog} onHide={this.handleCloseErrorDialog.bind(this)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ color: 'red' }}>{this.state.errorMessage}</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button success-button" onClick={this.handleCloseErrorDialog.bind(this)}>Ok</button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleCloseErrorDialog() {
    this.setState((prevState) => ({ ...prevState, openErrorDialog: false }));
  }

  getEntityRelatedEntities(entity) {
    let result = [];
    if (!entity) {
      return result;
    }
    entity.data.sections.forEach(item => {
      item.items.forEach(subItem => {
        if (subItem.entityId) {
          result.push({ type: subItem.xtype, name: subItem.name.replace('entity-', '') });
        }
      })
    });

    return result;
  }

  handleRefreshButtonClick() {
    this.getDataEntity(this.props.entity);
    this.setState({ isUpdated: false })
  }

  handleCloneButtonClick() {
    let entityData = { ...this.state.entityData, id: null, code: this.state.entityData.code + new Date().getTime() };
    if (entityData && entityData.customClientData && entityData.customClientData.syncStates) {
      delete entityData.customClientData.syncStates;
    }
    this.props.onEntityItemClick({ entityName: this.props.entity.entityName }, this.props.entity.entityId, null, entityCloneType, entityData);
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
    this.setState((prevState) => ({ ...prevState, openDeleteConfirmation: true }));
  }

  handleSynchronizeButtonClick() {

    let entity = this.props.entity;
    this.setState((prevState) => ({ ...prevState, isDataLoading: true }));
    if (entity.type === entityBulkEdit) {
      this.bulkSynchronize();
      return;
    }
    ApiCall.get('backend/synchronize', { entityName: entity.entityName, id: entity.itemId }).then(() => {
      this.props.openNotificationSnackbar('Entity successfully synchronized');
      this.setState((prevState) => ({ ...prevState, isDataLoading: false, entitySyncStatus: 'COMPLETED' }));
    }, this.handleRequestError.bind(this))
  }

  handleSaveButtonClick(windowShouldClose) {

    if (!this.isRequiredFieldValid()) {
      return;
    }
    this.setState((prevState) => ({ ...prevState, isDataLoading: true }));

    let entity = this.props.entity;
    let dirtyEntityProps = this.getDirtyEntityProps();
    let resultObject = entity.type === entityCloneType ? this.getCloneInitialDataForSave() : {};
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
    if (entity.type === entityBulkEdit) {
      this.bulkEditSave(resultObject);
      return;
    }
    ApiCall[restMethod](entity.entityUrl || restUrl, resultObject).then((result) => {
      this.props.onUpdateEntitySearchView(this.props.entity);
      let itemId = entity.type === entityItemType ? entity.itemId : result.data.id;
      this.props.openNotificationSnackbar('Entity successfully saved');
      this.resetDirtyEntityFields();

      this.uploadMediaFile(itemId, mediaFields, windowShouldClose).then(() => {
        if (windowShouldClose) {
          this.props.onEntityWindowClose(this.props.entity);
        } else if (entity.type === entityCreateType || entity.type === entityCloneType) {
          this.props.updateCreatedEntity(entity, itemId, result.data.code);
        } else if (resultObject.code) {
          this.props.updateNavigationCode(this.props.entity, resultObject.code);
        }
        this.setState((prevState) => ({ ...prevState, isDataLoading: false, entitySyncStatus: 'OUT_OF_SYNC' }));
      });
    }, this.handleRequestError.bind(this));
  }

  bulkEditSave(resultObj) {
    if (_.isEmpty(resultObj)) {
      this.setState((prevState) => ({ ...prevState, isDataLoading: false }));
      return;
    }
    let ids = this.props.entity.additionParams;
    let hasError = false;
    for (let i = 0, p = Promise.resolve(); i < ids.length; i++) {
      p = p.then(() => new Promise(resolve => {
        let url = `${this.props.entity.entityName}/${ids[i]}`;
        if (hasError) {
          resolve();
          return;
        }
        ApiCall.patch(url, resultObj).then(() => {
          if (i === ids.length - 1) {
            this.props.onUpdateEntitySearchView(this.props.entity);
            this.resetDirtyEntityFields();
            this.props.openNotificationSnackbar('All entities successfully saved');
            this.setState((prevState) => ({ ...prevState, isDataLoading: false }));
          }
          resolve();
        }, err => {
          hasError = true;
          this.handleRequestError(err);
          this.resetDirtyEntityFields();
          this.props.onUpdateEntitySearchView(this.props.entity);
          resolve();
        })
      }
      ));
    }
  }

  bulkSynchronize() {
    let ids = this.props.entity.additionParams;
    let hasError = false;
    let entityName = this.props.entity.entityName;
    for (let i = 0, p = Promise.resolve(); i < ids.length; i++) {
      p = p.then(() => new Promise(resolve => {
        if (hasError) {
          resolve();
          return;
        }
        ApiCall.get('backend/synchronize', { entityName: entityName, id: ids[i] }).then(() => {
          if (i === ids.length - 1) {
            this.props.openNotificationSnackbar('All entities successfully synchronized');
            this.setState((prevState) => ({ ...prevState, isDataLoading: false }));
          }
          resolve();
        }, err => {
          hasError = true;
          this.handleRequestError(err);
          resolve();
        })
      }
      ));
    }
  }

  getCloneInitialDataForSave() {
    let entityData = { ...this.state.entityData };
    _.forIn(entityData.customClientData, (value, key) => {
      if (!value) {
        entityData[key] = value;
      } else if (Array.isArray(value)) {
        entityData[key] = value.map(item => item.id);
      } else {
        entityData[key] = value.id;
      }
    });

    delete entityData.customClientData;
    return entityData;
  }

  uploadMediaFile(itemId, mediaFields) {
    if (!mediaFields || mediaFields.length === 0) {
      return Promise.resolve();
    }
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

  enableSaveButtons = () => {
    this.setState({ isUpdated: true })
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

    this.setState((prevState) => ({ ...prevState, errorMessage: errorMsg, openErrorDialog: true, isDataLoading: false }));
    // this.setState({...this.state, errorMessage: errorMsg, openErrorDialog: true, isDataLoading: false})
  }

  handleCloseDeleteConfirmation() {
    this.setState((prevState) => ({ ...prevState, openDeleteConfirmation: false }));
  };

  getAdditionalItem() {
    return false;
  }

  openRest() {
    let restUrl = document.getElementById('rest-base-url').getAttribute('url');
    let url = this.props.entity.entityUrl || `${restUrl}${this.props.entity.entityName}/${this.props.entity.itemId}`;

    window.open(url, '_blank')
  }

  getRequiredStar(items) {
    if (_.some(items, { required: true })) {
      return <span className="required-star">*</span>;
    }

    return false;
  }
}
