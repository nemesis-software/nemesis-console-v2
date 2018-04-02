import React, {Component} from 'react';

import _ from 'lodash';

import { componentRequire } from '../../../utils/require-util';

import {nemesisFieldTypes} from '../../../types/nemesis-types';

import Modal from 'react-bootstrap/lib/Modal';

import ApiCall from 'servicesDir/api-call';

let NemesisTextField = componentRequire('app/components/field-components/nemesis-text-field/nemesis-text-field', 'nemesis-text-field');
let NemesisNumberField = componentRequire('app/components/field-components/nemesis-number-field/nemesis-number-field', 'nemesis-number-field');
let NemesisEnumField = componentRequire('app/components/field-components/nemesis-enum-field/nemesis-enum-field', 'nemesis-enum-field');
let NemesisBooleanField = componentRequire('app/components/field-components/nemesis-boolean-field/nemesis-boolean-field', 'nemesis-boolean-field');

export default class MasterAdminFieldPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {openDeleteConfirmation: false, isFieldCollapsed: !!this.props.field.id};
    this.fieldTypes = _.values(nemesisFieldTypes);
    this.fieldsReferences = [];
  }

  componentWillMount() {
    this.fieldsReferences = [];
  }

  componentWillUpdate() {
    this.fieldsReferences = [];
  }

  render() {
    return (
      <div className="master-admin-field-panel paper-box">
        <div className="master-admin-field-panel-header" onClick={this.handleOnHeaderClick.bind(this)}>
          {this.props.field.name}
          <div className="delete-icon-container" onClick={this.handleDeleteButtonClick.bind(this)}><i className="material-icons">delete_forever</i></div>
        </div>
        <div className={'master-admin-fields-container' + (this.state.isFieldCollapsed ? ' collapsed' : '')}>
          <NemesisTextField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{width: '265px'}} name="fieldLabel" value={this.props.field.fieldLabel} required={true} label="Field label"/>
          <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{width: '265px'}} name="weight" value={this.props.field.weight} label="Weight"/>
          <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{padding: '5px'}} name="updatable" value={this.props.field.updatable} label="Updatable"/>
          <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{padding: '5px'}} name="insertable" value={this.props.field.insertable} label="Insertable"/>
          <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{padding: '5px'}} name="required" value={this.props.field.required} label="Required"/>
          <NemesisEnumField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} clearable={false} style={{width: '265px'}} name="xtype" label="Field type" values={this.fieldTypes} value={_.indexOf(this.fieldTypes, this.props.field.xtype)}/>
          <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{padding: '5px'}} name="searchable" value={this.props.field.searchable} label="Searchable"/>
          <hr/>
          <NemesisTextField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{width: '265px'}} name="section" value={this.props.field.section} label="Section"/>
          <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{width: '265px'}} name="sectionWeight" value={this.props.field.sectionWeight} label="Section weight"/>
          <hr/>
          <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{padding: '5px'}} name="inMainView" value={this.props.field.inMainView} label="In main view"/>
          <NemesisTextField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{width: '265px'}} name="groupName" value={this.props.field.groupName} label="Group name"/>
          <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{padding: '5px'}} name="embeddedCreationAllowed" value={this.props.field.embeddedCreationAllowed} label="Embedded Creation"/>
        </div>
        {this.getDeleteConfirmationDialog()}
      </div>
    )
  }

  onSaveButtonClick() {
    if (!this.isFieldsValid()) {
      return;
    }

    this.setState({...this.state, isLoading: true});

    let dirtyEntityProps = this.getDirtyValues();
    if (dirtyEntityProps.length === 0 && this.props.field.id) {
      return;
    }
    let resultObject = this.props.field.id ? {} : {...this.props.field, entityConfig: this.props.selectedEntityConfigId};
    dirtyEntityProps.forEach(prop => {
      resultObject[prop.name] = prop.value;
    });
    let restMethod = this.props.field.id ? 'patch' : 'post';
    let restUrl = this.props.field.id ? `entity_property_config/${this.props.field.id}` : 'entity_property_config';
    ApiCall[restMethod](restUrl, resultObject).then((result) => {
      this.props.openNotificationSnackbar(`${this.props.field.name} successfully saved!`);
      this.resetDirtyStates();
    }, this.handleRequestError.bind(this));
  }

  resetDirtyStates() {
    this.fieldsReferences.forEach(field => {
      field.resetDirtyState();
    });
  }

  isFieldsValid() {
    let isNotValid = false;
    this.fieldsReferences.forEach(field => {
      let isFieldValid = field.isFieldValid();
      isNotValid = isNotValid || !isFieldValid;
    });
    return !isNotValid;
  }

  getDirtyValues() {
    let result = [];
    this.fieldsReferences.forEach(field => {
      let dirtyValue = field.getChangeValue();
      if (dirtyValue) {
        result.push(dirtyValue);
      }
    });
    return result;
  }

  handleRequestError(err) {
    console.log(err);
  }

  getDeleteConfirmationDialog() {
    return (
      <Modal show={this.state.openDeleteConfirmation} onHide={this.handleCloseDeleteConfirmation.bind(this)}>
        <Modal.Header>
          <Modal.Title>Delete Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to delete it?</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={this.handleCloseDeleteConfirmation.bind(this)}>No</button>
          <button className="nemesis-button success-button" onClick={this.handleConfirmationDeleteButtonClick.bind(this)}>Yes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleConfirmationDeleteButtonClick() {
    if (!this.props.field.id) {
      this.setState({openDeleteConfirmation: false}, () => {
        this.props.onDeleteField(this.props.field.name);
      });
      return;
    }

    ApiCall.delete(`entity_property_config/${this.props.field.id}`).then(() => {
      this.setState({openDeleteConfirmation: false}, () => {
        this.props.onDeleteField(this.props.field.name);
      });
    }, this.handleRequestError.bind(this))
  }

  handleCloseDeleteConfirmation() {
    this.setState({openDeleteConfirmation: false});
  };


  handleDeleteButtonClick() {
    this.setState({openDeleteConfirmation: true});
  }

  handleOnHeaderClick(ev) {
    if (!ev.target.classList.contains('master-admin-field-panel-header')) {
      return;
    }
    this.setState({isFieldCollapsed: !this.state.isFieldCollapsed})
  }
}