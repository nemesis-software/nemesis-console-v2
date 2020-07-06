import React, { Component } from 'react';

import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';
import { componentRequire } from '../../../../../../utils/require-util';

import FilterHelper from 'servicesDir/filter-helper';

let NemesisBooleanField = componentRequire('app/components/field-components/nemesis-boolean-field/nemesis-boolean-field', 'nemesis-boolean-field');

export default class FilterBooleanField extends Component {
  constructor(props) {
    super(props);
    this.state = {booleanField: props.defaultValue || null};
  }

  render() {
    return (
      <div className="filter-item-container">
        <NemesisBooleanField readOnly={this.props.readOnly} value={this.state.booleanField} onValueChange={this.onBooleanFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      this.updateParentFilter(this.props.defaultValue);
    }
  }

  onBooleanFieldChange(value) {
    this.setState({booleanField: value});
    this.updateParentFilter(value);
  }

  updateParentFilter(booleanField) {
    const {filterItem} = this.props;

    this.props.onFilterChange({
      value: booleanField,
      restriction: searchRestrictionTypes.equals,
      field: filterItem.name,
      id: filterItem.name,
      textRepresentation: this.getTextRepresentation(filterItem.name, searchRestrictionTypes.equals, this.getBooleanTextRepresentation(booleanField))
    });
  }

  getTextRepresentation(name, restrictionValue, value) {
    return FilterHelper.getFilterFieldTextRepresentation(name, restrictionValue, value);
  }

  getBooleanTextRepresentation(value) {
    if (value === true || value === false) {
      return value.toString();
    }

    return null;
  }
}