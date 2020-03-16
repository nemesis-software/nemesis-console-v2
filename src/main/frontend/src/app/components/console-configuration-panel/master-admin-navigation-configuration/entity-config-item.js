import React, {Component} from 'react';

import ApiCall from 'servicesDir/api-call'
import DataHelper from "../../../services/data-helper";

import {componentRequire} from "../../../utils/require-util";

import {Modal} from 'react-bootstrap';

let NemesisTextField = componentRequire('app/components/field-components/nemesis-text-field/nemesis-text-field', 'nemesis-text-field');
let NemesisNumberField = componentRequire('app/components/field-components/nemesis-number-field/nemesis-number-field', 'nemesis-number-field');
let NemesisCategoriesCollection = componentRequire('app/components/field-components/nemesis-collection-field/nemesis-categories-entity-collection/nemesis-categories-entity-collection', 'nemesis-categories-entity-collection');

const mainEntity = {entityName: 'entity_config'};

export default class EntityConfigItem extends Component {
  constructor(props) {
    super(props);
    this.fieldsReferences = [];
    this.state = {categories: [], openDeleteConfirmation: false}
  }

  componentDidMount() {
    if (this.props.config.id) {
      ApiCall.get(this.props.config._links.categories.href, {projection: 'search'}).then(result => {
        this.setState({categories: DataHelper.mapCollectionData(result.data)});
      });
    }
    this.fieldsReferences = [];
  }

  UNSAFE_componentWillUpdate() {
    this.fieldsReferences = [];
  }


  render() {
    return (
      <div className="navigation-entity-config-item ">
        <div className="navigation-entity-config-item-header">
          <div className="back-button" title="back" onClick={this.props.handleBackButton}><i className="material-icons">arrow_back</i></div>
          <button className="nemesis-button danger-button save-button" onClick={this.handleDeleteButtonClick.bind(this)}>Delete</button>
          <button className="nemesis-button success-button save-button" onClick={this.onSaveButtonClick.bind(this)}>Save</button>
        </div>
        <div className="paper-box navigation-entity-config-fields">
          <NemesisTextField mainEntity={mainEntity} ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} readOnly={!!this.props.config.id} style={{width: '265px'}} name="code" value={this.props.config.code} required={true} label="Code"/>
          <NemesisNumberField mainEntity={mainEntity} ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{width: '265px'}} name="weight" value={this.props.config.weight} label="Weight"/>
          <div className="categories-container">
            <NemesisCategoriesCollection mainEntity={mainEntity} onEntityItemClick={() => {}} entityId="category" ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{width: '265px'}} name="categories" value={this.state.categories} label="Categories"/>
          </div>
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
    if (dirtyEntityProps.length === 0 && this.props.config.id) {
      return;
    }
    let resultObject = {};
    dirtyEntityProps.forEach(prop => {
      resultObject[prop.name] = prop.value;
    });
    let restMethod = this.props.config.id ? 'patch' : 'post';
    let restUrl = this.props.config.id ? `entity_config/${this.props.config.id}` : 'entity_config';
    ApiCall[restMethod](restUrl, resultObject).then((result) => {
      this.props.openNotificationSnackbar(`Config successfully saved!`);
      this.props.reloadData();
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
    this.props.openNotificationSnackbar(`Save failed!` , 'error');
    console.log(err);
  }

  getDeleteConfirmationDialog() {
    return (
      <Modal show={this.state.openDeleteConfirmation} onHide={this.handleCloseDeleteConfirmation.bind(this)} animation={false}>
        <Modal.Header>
          <Modal.Title>Delete Config</Modal.Title>
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
    ApiCall.delete(`entity_config/${this.props.config.id}`).then(() => {
      this.setState({openDeleteConfirmation: false}, () => {
        this.props.reloadData();
        this.props.handleBackButton();
      });
    }, this.handleRequestError.bind(this))
  }

  handleCloseDeleteConfirmation() {
    this.setState({openDeleteConfirmation: false});
  };


  handleDeleteButtonClick() {
    this.setState({openDeleteConfirmation: true});
  }

}
