import React, { Component } from 'react';
import Translate from 'react-translate-component';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import NemesisBaseField from '../nemesis-base-field'
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';

const styles = {
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

export default class NemesisBooleanField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style} >
        <Translate component="div" style={{...styles.container, ...styles.label}} content={'main.' + this.props.label} fallback={this.props.label} />
        <RadioButtonGroup name="boolean" labelPosition="right" style={styles.container}
                          valueSelected={this.state.value}
                          onChange={this.onValueChange.bind(this)}
        >
          <RadioButton
            style={styles.container}
            value="true"
            label="True"
            disabled={this.props.readOnly}
          />
          <RadioButton
            style={styles.container}
            value="false"
            label="False"
            disabled={this.props.readOnly}
          />
          <RadioButton
            style={this.getNotAvailableButtonStyle()}
            value="null"
            label="N/A"
            disabled={this.props.readOnly}
          />
        </RadioButtonGroup>
      </div>
    )
  }

  setFormattedValue(value) {
    if (value === undefined) {
      return;
    }

    return value + '';
  }

  getFormattedValue(value) {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return null;
  }

  getNotAvailableButtonStyle() {
    let style = {...styles.container};
    if (this.props.type !== nemesisFieldUsageTypes.edit) {
      style.display = 'none';
    }

    return style;
  }
}