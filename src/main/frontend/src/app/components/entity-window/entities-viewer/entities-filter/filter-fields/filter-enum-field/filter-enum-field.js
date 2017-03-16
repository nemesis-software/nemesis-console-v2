import React, { Component } from 'react';
import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';
import NemesisEnumField from '../../../../../field-components/nemesis-enum-field/nemesis-enum-field'

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
      <div className="filter-item-container">
        <NemesisEnumField style={styles} values={this.props.filterItem.values} onValueChange={this.onEnumFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
  }

  onEnumFieldChange(value) {
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
}