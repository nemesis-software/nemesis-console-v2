import React, {Component} from 'react';

import _ from 'lodash';

import counterpart from 'counterpart';
import { componentRequire } from '../../../utils/require-util';

import {nemesisFieldTypes} from '../../../types/nemesis-types';

import Translate from 'react-translate-component';

import ApiCall from 'servicesDir/api-call';

let NemesisTextField = componentRequire('app/components/field-components/nemesis-text-field/nemesis-text-field', 'nemesis-text-field');
let NemesisNumberField = componentRequire('app/components/field-components/nemesis-number-field/nemesis-number-field', 'nemesis-number-field');
let NemesisEnumField = componentRequire('app/components/field-components/nemesis-enum-field/nemesis-enum-field', 'nemesis-enum-field');
let NemesisBooleanField = componentRequire('app/components/field-components/nemesis-boolean-field/nemesis-boolean-field', 'nemesis-boolean-field');

export default class MasterAdminFieldPanel extends Component {
  constructor(props) {
    super(props);
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
        <NemesisTextField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} name="name" value={this.props.field.name} label="Name" readOnly={true}/>
        <NemesisTextField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} name="fieldLabel" value={this.props.field.fieldLabel} label="Field label"/>
        <NemesisTextField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} name="section" value={this.props.field.section} label="Section"/>
        <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} name="weight" value={this.props.field.weight} label="Weight"/>
        <NemesisNumberField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} name="sectionWeight" value={this.props.field.sectionWeight} label="Section weight"/>
        <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} name="updatable" value={this.props.field.updatable} label="Updatable"/>
        <NemesisBooleanField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} name="insertable" value={this.props.field.insertable} label="Insertable"/>
        <NemesisEnumField ref={(fieldPanel) => {fieldPanel && this.fieldsReferences.push(fieldPanel)}} style={{width: '265px'}} name="xtype" label="Field type" values={this.fieldTypes} value={_.indexOf(this.fieldTypes, this.props.field.xtype)}/>
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
    let restMethod = this.props.field.id ? 'patch' : 'post';
    let restUrl = this.props.field.id ? `entity_property_config/${this.props.field.id}` : 'entity_property_config';
    ApiCall[restMethod](restUrl, resultObject).then((result) => {
      //TODO: on update
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
}