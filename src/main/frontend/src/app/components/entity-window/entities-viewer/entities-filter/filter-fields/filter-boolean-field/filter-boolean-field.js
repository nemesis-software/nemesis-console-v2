import React, { Component } from 'react';
import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';
import NemesisBooleanField from '../../../../../field-components/nemesis-boolean-field/nemesis-boolean-field';

const styles = {
  parent: {
    margin: '20px 0'
  },
  container: {
    display: 'inline-block',
    width: 'auto',
    marginRight: '10px'
  }
};
export default class FilterBooleanField extends Component {
  constructor(props) {
    super(props);
    this.state = {booleanField: null};
  }

  render() {
    return (
      <div className="filter-item-container boolean-field-container">
        <NemesisBooleanField style={styles.container} onValueChange={this.onBooleanFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
  }

  onBooleanFieldChange(value) {
    this.setState({booleanField: value});
    this.updateParentFilter(value);
  }

  updateParentFilter(booleanField) {
    this.props.onFilterChange({
      value: booleanField,
      restriction: searchRestrictionTypes.equals,
      field: this.props.filterItem.name,
      id: this.props.filterItem.name
    });
  }
}