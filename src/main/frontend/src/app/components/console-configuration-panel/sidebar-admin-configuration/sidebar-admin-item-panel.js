import React, {Component} from 'react';
import {componentRequire} from "../../../utils/require-util";

import {Modal} from 'react-bootstrap';

import ApiCall from 'servicesDir/api-call';

import SidebarAdminEntitiesNameCollection from './sidebar-admin-entities-name-collection';

let NemesisTextField = componentRequire('app/components/field-components/nemesis-text-field/nemesis-text-field', 'nemesis-text-field');

export default class SidebarAdminItemPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {openDeleteConfirmation: false};
    this.fieldsReferences = [];
  }

  componentDidMount() {
    this.fieldsReferences = [];
  }

  UNSAFE_componentWillUpdate() {
    this.fieldsReferences = [];
  }

  render() {
    return (
      <div className="sidebar-admin-item-panel paper-box">
        <div className="delete-icon-container" onClick={this.handleDeleteButtonClick.bind(this)}><i className="material-icons">delete_forever</i></div>
        <NemesisTextField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{width: '265px'}} name="code" value={this.props.item.code} required={true} label="Code"/>
        <SidebarAdminEntitiesNameCollection ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} allEntitiesName={this.props.allEntitiesName} name="entityNames" value={this.props.item.entityNames} label="Entity names" />
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
    if (dirtyEntityProps.length === 0) {
      return;
    }
    let resultObject = {};
    dirtyEntityProps.forEach(prop => {
      resultObject[prop.name] = prop.value;
    });
    let restMethod = this.props.item.id ? 'patch' : 'post';
    let restUrl = this.props.item.id ? `sidebar_section/${this.props.item.id}` : 'sidebar_section';
    ApiCall[restMethod](restUrl, resultObject).then((result) => {
      this.props.openNotificationSnackbar(`${this.props.item.code || resultObject.code} section successfully saved!`);
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
      <Modal show={this.state.openDeleteConfirmation} onHide={this.handleCloseDeleteConfirmation.bind(this)} animation={false}>
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
    if (!this.props.item.id) {
      this.props.onDeleteField(this.props.itemIndex);
      return;
    }

    ApiCall.delete(`sidebar_section/${this.props.item.id}`).then(() => {
      this.props.onDeleteField(this.props.itemIndex);
    }, this.handleRequestError.bind(this))
  }

  handleCloseDeleteConfirmation() {
    this.setState({openDeleteConfirmation: false});
  };


  handleDeleteButtonClick() {
    this.setState({openDeleteConfirmation: true});
  }
}