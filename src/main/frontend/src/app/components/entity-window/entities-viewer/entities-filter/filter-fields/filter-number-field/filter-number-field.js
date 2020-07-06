import React, { Component } from 'react';

import { componentRequire } from '../../../../../../utils/require-util';
import { searchRestrictionTypes, nemesisFieldTypes } from '../../../../../../types/nemesis-types';

import FilterHelper from 'servicesDir/filter-helper';

let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let NemesisNumberField = componentRequire('app/components/field-components/nemesis-number-field/nemesis-number-field', 'nemesis-number-field');

const restrictionFields = [
  searchRestrictionTypes.greaterThan,
  searchRestrictionTypes.lessThan,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

export default class FilterNumberField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: props.defaultRestriction || null, numberField: props.defaultValue || null};
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} restrictionFields={restrictionFields}/>
        {this.isNumberFieldVisible() ? <NemesisNumberField readOnly={this.props.readOnly || !this.state.restrictionField} value={this.state.numberField} step={this.props.filterItem.xtype === nemesisFieldTypes.nemesisDecimalField ? '0.1' : '1'} onValueChange={this.onNumberFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/> : false}
      </div>
    )
  }

  componentDidMount() {
    if (this.props.defaultRestriction || this.props.defaultValue) {
      this.updateParentFilter(this.props.defaultValue, this.props.defaultRestriction)
    }
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.numberField, restrictionValue);
  }

  onNumberFieldChange(value) {
    this.setState({...this.state, numberField: value});
    this.updateParentFilter(value, this.state.restrictionField);
  }

  updateParentFilter(numberField, restrictionValue) {
    const {filterItem} = this.props;
    
    this.props.onFilterChange({
      filterItemKey:filterItem.key,
      value: numberField,
      restriction: restrictionValue,
      field: filterItem.name,
      id: filterItem.name,
      textRepresentation: this.getTextRepresentation(filterItem.name, restrictionValue, numberField)
    });
  }

  isNumberFieldVisible() {
    return !([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1);
  }

  getTextRepresentation(name, restrictionValue, value) {
    return FilterHelper.getFilterFieldTextRepresentation(name, restrictionValue, value);
  }
}