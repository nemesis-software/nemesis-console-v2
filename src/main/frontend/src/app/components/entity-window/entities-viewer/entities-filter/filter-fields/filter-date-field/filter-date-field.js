import React, { Component } from 'react';
import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';
import { componentRequire } from '../../../../../../utils/require-util';

let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let NemesisDateField = componentRequire('app/components/field-components/nemesis-date-field/nemesis-date-field', 'nemesis-date-field');

const restrictionFields = [
  searchRestrictionTypes.before,
  searchRestrictionTypes.after,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull
];

export default class FilterDateField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: props.defaultRestriction || null, dateField: props.defaultValue || null};
  }

  componentWillMount() {
    if (this.props.defaultRestriction || this.props.defaultValue) {
      this.updateParentFilter(this.props.defaultValue, this.props.defaultRestriction);
    }
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields  readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} restrictionFields={restrictionFields}/>
        {this.isDateFieldVisible() ? <NemesisDateField readOnly={this.props.readOnly || !this.state.restrictionField} value={this.state.dateField} onValueChange={this.onDateFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/> : false}
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.dateField, restrictionValue);
  }

  onDateFieldChange(value) {
    this.setState({...this.state, dateField: value});
    this.updateParentFilter(value, this.state.restrictionField);
  }

  updateParentFilter(dateField, restrictionValue) {
    this.props.onFilterChange({
      value: dateField,
      restriction: restrictionValue,
      field: this.props.filterItem.name,
      id: this.props.filterItem.name
    });
  }

  isDateFieldVisible() {
    return !([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1);
  }
}