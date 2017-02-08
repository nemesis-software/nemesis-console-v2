import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'

export default class NemesisNumberField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TextField style={this.props.style}
                 type="number" step={this.getStepSize()}
                 value={this.state.value || ''}
                 disabled={this.props.readOnly}
                 floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                 onChange={this.onValueChange.bind(this)}/>
    )
  }

  getStepSize() {
    return '1';
  }
}