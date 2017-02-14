import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'

export default class NemesisTextAreaField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TextField style={this.props.style}
                 value={this.state.value || ''}
                 disabled={this.props.readOnly}
                 multiLine={true}
                 rows={1}
                 rowsMax={4}
                 floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                 onChange={this.onValueChange.bind(this)}/>
    )
  }
}