import React, {Component} from 'react';
import CsvFieldsComponent from './csv-fields-component';
import NemesisEnumField from '../../field-components/nemesis-enum-field/nemesis-enum-field';
import NemesisTextField from '../../field-components/nemesis-text-field/nemesis-text-field';

export default class CsvDtoBlock extends Component {
  constructor(props) {
    super(props);
    this.enumElement = null;
    this.textElement = null;
    this.fieldsElement = null;
  }

  render() {
    return (
      <div className="csv-dto-block">
        <i className="fa fa-window-close remove-button" onClick={() => {this.props.removeBlock(this.props.identityKey)}}/>
        <NemesisEnumField style={{width: '265px'}} ref={el => this.enumElement = el} required={true} label="Verb" values={['MERGE' , 'REMOVE', 'PERSIST']} value={-1}/>
        <NemesisTextField style={{width: '768px'}} ref={el => this.textElement = el} required={true} label="Entity class" />
        <CsvFieldsComponent style={{width: '1043px'}} ref={el => this.fieldsElement = el} required={true} label="Fields"/>
      </div>
    );
  }

  isBlockValid() {
    //Its make like this to can all validators be called
    let enumsIsValid = this.enumElement.isFieldValid();
    let textIsValid = this.textElement.isFieldValid();
    let fieldsAreValid = this.fieldsElement.isFieldValid();
    return enumsIsValid && textIsValid && fieldsAreValid;
  }

  getBlockData() {
    let result = {};
    result.verb = this.enumElement.getChangeValue().value;
    result.entityClass = this.textElement.getChangeValue().value;
    result.fields = this.fieldsElement.getChangeValue().value;
    return result;
  }
}