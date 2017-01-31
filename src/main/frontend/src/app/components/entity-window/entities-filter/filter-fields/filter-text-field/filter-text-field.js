import React, { Component } from 'react';
import FilterRestrictionFields from '../filter-restriction-field/filter-restriction-field';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import { searchRestrictionTypes } from '../../../../../types/nemesis-types';
import _ from 'lodash';

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
        <FilterRestrictionFields onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <TextField style={this.getTextFieldStyles()}
          floatingLabelText={<Translate content={'main.' + this.props.filterItem.fieldLabel} fallback={this.props.filterItem.fieldLabel} />}
          onChange={_.debounce(this.onTextFieldChange.bind(this), 250)}/>
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.textField, restrictionValue);
  }

  onTextFieldChange(event, value) {
    this.setState({...this.state, textField: value});
    this.updateParentFilter(value, this.state.restrictionField);
  }

  updateParentFilter(textField, restrictionValue) {
    this.props.onFilterChange({
      value: `'${textField}'`,
      restriction: restrictionValue,
      field: this.props.filterItem.name
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