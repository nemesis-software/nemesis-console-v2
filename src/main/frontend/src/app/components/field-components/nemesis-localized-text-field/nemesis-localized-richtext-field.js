import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisLocalizedTextField from './nemesis-localized-text-field'

export default class NemesisTextField extends NemesisLocalizedTextField {
  constructor(props) {
    super(props);
  }

  getInputField() {
    return (
      <TextField style={this.props.style}
                 value={this.getTextFieldValue()}
                 disabled={this.props.readOnly}
                 multiLine={true}
                 rowsMax={4}
                 floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                 onChange={this.onTextChange.bind(this)}/>
    )
  }
}