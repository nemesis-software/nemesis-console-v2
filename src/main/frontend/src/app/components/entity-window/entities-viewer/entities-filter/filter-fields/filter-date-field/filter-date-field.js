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

const styles = {
  verticalAlign: 'top',
  marginRight: '10px'
};

export default class FilterDateField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: null, dateField: null};
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <NemesisDateField style={this.getDateFieldStyles()} onValueChange={this.onDateFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/>
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

  getDateFieldStyles() {
    let result = {...styles};
    result.display = 'inline-block';
    if ([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1) {
      result.display = 'none';
    }

    return result;
  }
}