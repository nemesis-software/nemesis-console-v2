import React from 'react';
import Translate from 'react-translate-component';
import NemesisLocalizedTextField from './nemesis-localized-text-field'

export default class NemesisTextField extends NemesisLocalizedTextField {
  constructor(props) {
    super(props);
  }

  getDialogInputField(language, index) {
    return (
      <div key={index}>
        <Translate component="label" content={'main.' + language.labelCode} fallback={language.labelCode} />
        <textarea className="entity-field form-control"
                  rows="4"
                  value={this.getTextFieldValue(language.value)}
                  disabled={this.props.readOnly}
                  onChange={(e) => this.onTextChange(e, e.target.value, language.value)}/>
      </div>
    )
  }
}