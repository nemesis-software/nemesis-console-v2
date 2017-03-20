import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisLocalizedTextField from './nemesis-localized-text-field'

export default class NemesisTextField extends NemesisLocalizedTextField {
  constructor(props) {
    super(props);
  }

  getDialogInputField(language, index) {
    return (
      <div key={index}>
        <TextField style={{width: '100%'}}
                   multiLine={true}
                   rows={4}
                   rowsMax={4}
                   value={this.getTextFieldValue(language.value)}
                   disabled={this.props.readOnly}
                   floatingLabelText={language.labelCode}
                   onChange={(e, v) => this.onTextChange(e, v, language.value)}/>
      </div>
    )
  }
}