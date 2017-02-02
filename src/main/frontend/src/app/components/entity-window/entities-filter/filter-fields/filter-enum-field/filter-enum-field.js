import React, { Component } from 'react';
import Translate from 'react-translate-component';
import { searchRestrictionTypes } from '../../../../../types/nemesis-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  verticalAlign: 'top',
  marginRight: '10px'
};

export default class FilterEnumField extends Component {
  constructor(props) {
    super(props);
    this.state = {enumField: null};
  }

  render() {
    return (
      <div>
        <SelectField
          style={this.getEnumFieldStyles()}
          value={this.state.enumField}
          floatingLabelText={<Translate content={'main.' + this.props.filterItem.fieldLabel} fallback={this.props.filterItem.fieldLabel} />}
          onChange={this.onEnumFieldChange.bind(this)}>
          {this.props.filterItem.values.map((value, index) => <MenuItem key={index} value={value} primaryText={value} />)}
        </SelectField>
      </div>
    )
  }

  onEnumFieldChange(event, index) {
    let value = this.props.filterItem.values[index];
    this.setState({enumField: value});
    this.updateParentFilter(value);
  }

  updateParentFilter(enumField)  {
    this.props.onFilterChange({
      value: enumField,
      restriction: searchRestrictionTypes.equals,
      field: this.props.filterItem.name,
      id: this.props.filterItem.name
    });
  }

  getEnumFieldStyles() {
    let result = {...styles};
    if ([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1) {
      result.display = 'none';
    }

    return result;
  }
}