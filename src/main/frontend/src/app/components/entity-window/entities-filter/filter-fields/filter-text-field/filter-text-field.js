import React, { Component } from 'react';
import FilterRestrictionFields from '../filter-restriction-field/filter-restriction-field';
import { searchRestrictionTypes } from '../../../../../types/nemesis-types';
import _ from 'lodash';
import NemesisTextField from '../../../../field-components/nemesis-text-field/nemesis-text-field';

const restrictionFields = [
  searchRestrictionTypes.startingWith,
  searchRestrictionTypes.endingWith,
  searchRestrictionTypes.contains,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

const styles = {
  verticalAlign: 'top',
  marginRight: '10px'
};

export default class FilterTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: null, textField: null};
  }

  render() {
    return (
      <div>
        <FilterRestrictionFields label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <NemesisTextField style={this.getTextFieldStyles()} onValueChange={_.debounce(this.onTextFieldChange.bind(this), 250)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.textField, restrictionValue);
  }

  onTextFieldChange(value) {
    this.setState({...this.state, textField: value});
    this.updateParentFilter(value, this.state.restrictionField);
  }

  updateParentFilter(textField, restrictionValue) {
    this.props.onFilterChange({
      value: _.isEmpty(textField) ? null : `'${textField}'`,
      restriction: restrictionValue,
      field: this.props.filterItem.name,
      id: this.props.filterItem.name
    });
  }

  getTextFieldStyles() {
    let result = {...styles};
    if ([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1) {
      result.display = 'none';
    }

    return result;
  }
}