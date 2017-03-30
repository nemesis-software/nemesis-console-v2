import React, { Component } from 'react';

import _ from 'lodash';

import { componentRequire } from '../../../../../../utils/require-util';
import { searchRestrictionTypes, nemesisFieldTypes } from '../../../../../../types/nemesis-types';

let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let NemesisNumberField = componentRequire('app/components/field-components/nemesis-number-field/nemesis-number-field', 'nemesis-number-field');

const restrictionFields = [
  searchRestrictionTypes.greaterThan,
  searchRestrictionTypes.lessThan,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

const styles = {
  verticalAlign: 'top',
  marginRight: '10px'
};

export default class FilterNumberField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: props.defaultRestriction || null, numberField: props.defaultValue || null};
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <NemesisNumberField readOnly={this.props.readOnly} value={this.state.numberField} step={this.props.filterItem.xtype === nemesisFieldTypes.nemesisDecimalField ? '0.1' : '1'} style={this.getNumberFieldStyles()} onValueChange={_.debounce(this.onNumberFieldChange.bind(this), 250)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
  }

  componentWillMount() {
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
    this.props.onFilterChange({
      value: numberField,
      restriction: restrictionValue,
      field: this.props.filterItem.name,
      id: this.props.filterItem.name
    });
  }

  getNumberFieldStyles() {
    let result = {...styles};
    if ([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1) {
      result.display = 'none';
    }

    return result;
  }
}