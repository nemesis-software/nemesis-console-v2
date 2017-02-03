import React, { Component } from 'react';
import FilterRestrictionFields from '../filter-restriction-field/filter-restriction-field';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import { searchRestrictionTypes, searchFormTypes } from '../../../../../types/nemesis-types';
import _ from 'lodash';

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
    this.state = {restrictionField: null, numberField: null};
  }

  render() {
    return (
      <div>
        <FilterRestrictionFields label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <TextField type="number" step={this.props.filterItem.xtype === searchFormTypes.nemesisDecimalField ? '0.1' : '1'} style={this.getNumberFieldStyles()}
                   floatingLabelText={<Translate content={'main.' + this.props.filterItem.fieldLabel} fallback={this.props.filterItem.fieldLabel} />}
                   onChange={_.debounce(this.onNumberFieldChange.bind(this), 250)}/>
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.textField, restrictionValue);
  }

  onNumberFieldChange(event, value) {
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