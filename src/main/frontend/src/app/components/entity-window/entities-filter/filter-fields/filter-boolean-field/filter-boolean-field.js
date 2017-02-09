import React, { Component } from 'react';
import { searchRestrictionTypes } from '../../../../../types/nemesis-types';
import NemesisBooleanField from '../../../../field-components/nemesis-boolean-field/nemesis-boolean-field';

const styles = {
  parent: {
    margin: '20px 0'
  },
  container: {
    display: 'inline-block',
    width: 'auto',
    marginRight: '10px'
  },
  label: {
    color: '#9e9e9e',
    fontSize: '18px',
    lineHeight: '24px',
    verticalAlign: 'top'
  }
};

export default class FilterBooleanField extends Component {
  constructor(props) {
    super(props);
    this.state = {booleanField: null};
  }

  render() {
    return (
      <NemesisBooleanField style={styles.container} onValueChange={this.onBooleanFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/>
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