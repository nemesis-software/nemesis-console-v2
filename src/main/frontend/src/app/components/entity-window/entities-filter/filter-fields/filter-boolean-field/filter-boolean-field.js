import React, { Component } from 'react';
import { searchRestrictionTypes } from '../../../../../types/nemesis-types';
import Translate from 'react-translate-component';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';

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
      <div style={styles.parent}>
        <Translate component="div" style={{...styles.container, ...styles.label}} content={'main.' + this.props.filterItem.fieldLabel} fallback={this.props.filterItem.fieldLabel} />
        <RadioButtonGroup name="boolean" labelPosition="right" style={styles.container}
                          onChange={this.onBooleanFieldChange.bind(this)}
                          >
          <RadioButton
            style={styles.container}
            value="true"
            label="True"
          />
          <RadioButton
            style={styles.container}
            value="false"
            label="False"
          />
        </RadioButtonGroup>
      </div>
    )
  }

  onBooleanFieldChange(event, value) {
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