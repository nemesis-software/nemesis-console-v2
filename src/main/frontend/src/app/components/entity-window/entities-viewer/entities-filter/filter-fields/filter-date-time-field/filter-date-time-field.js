import React, { Component } from 'react';
import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';
import { componentRequire } from '../../../../../../utils/require-util';

import FilterHelper from 'servicesDir/filter-helper';

let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let NemesisDateTimeField = componentRequire('app/components/field-components/nemesis-date-time-field/nemesis-date-time-field', 'nemesis-date-time-field');

const restrictionFields = [
  searchRestrictionTypes.between,
  searchRestrictionTypes.before,
  searchRestrictionTypes.after,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull
];

export default class FilterDateTimeField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: props.defaultRestriction || null, dateField: props.defaultValue || null, secondDateField: props.secondDefaultValue || null};
  }

  componentDidMount() {
    if (this.props.defaultRestriction || this.props.defaultValue) {
      let actualValue = this.props.defaultValue;
      if (this.props.defaultRestriction === searchRestrictionTypes.between) {
        actualValue = {from: this.props.defaultValue, to: this.props.secondDefaultValue};
      }
      this.updateParentFilter(actualValue, this.props.defaultRestriction);
    }
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} restrictionFields={restrictionFields}/>
        {this.isDateFieldVisible() ? <NemesisDateTimeField readOnly={this.props.readOnly || !this.state.restrictionField} value={this.state.dateField} onValueChange={this.onDateFieldChange.bind(this)} label={this.getFirstDateTimeLabel()}/> : false}
        {this.state.restrictionField === searchRestrictionTypes.between ? <NemesisDateTimeField readOnly={this.props.readOnly} value={this.state.secondDateField} onValueChange={this.onSecondDateFieldChange.bind(this)} label={`${this.props.filterItem.fieldLabel} to`}/> : false}
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.dateField, restrictionValue);
  }

  getFirstDateTimeLabel() {
    if (this.state.restrictionField === searchRestrictionTypes.between) {
      return `${this.props.filterItem.fieldLabel} from`;
    }

    return this.props.filterItem.fieldLabel;
  }

  onDateFieldChange(value) {
    this.setState({...this.state, dateField: value});
    let actualValue = value;
    if (this.state.restrictionField === searchRestrictionTypes.between) {
      actualValue = {from: value, to: this.state.secondDateField}
    }
    this.updateParentFilter(actualValue, this.state.restrictionField);
  }

  onSecondDateFieldChange(value) {
    this.setState({...this.state, secondDateField: value});
    let actualValue = value;
    if (this.state.restrictionField === searchRestrictionTypes.between) {
      actualValue = {from: this.state.dateField, to: value}
    }
    this.updateParentFilter(actualValue, this.state.restrictionField);
  }

  updateParentFilter(dateField, restrictionValue) {
    this.props.onFilterChange({
      value: dateField,
      restriction: restrictionValue,
      field: this.props.filterItem.name,
      id: this.props.filterItem.name,
      textRepresentation: this.getTextRepresentation(this.props.filterItem.name, restrictionValue, dateField)
    });
  }

  isDateFieldVisible() {
    return !([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1);
  }

  getTextRepresentation(name, restrictionValue, value) {
    return FilterHelper.getFilterFieldTextRepresentation(name, restrictionValue, value);
  }
}