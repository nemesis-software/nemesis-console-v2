import React from 'react';
import Translate from 'react-translate-component';
import NemesisLocalizedTextField from './nemesis-localized-text-field';
import HtmlEditor from '../../../custom-components/html-editor';

export default class NemesisTextField extends NemesisLocalizedTextField {
  constructor(props) {
    super(props);
  }

  getDialogInputField(language, index) {
    return (
      <div key={index}>
        <Translate component="label" content={'main.' + language.labelCode} fallback={language.labelCode} />
        <HtmlEditor htmlContent={this.getTextFieldValue(language.value)} onChange={(value) => this.onTextChange(null, value, language.value)} />
      </div>
    )
  }

  getOpenDialogIconClass() {
    return 'fa fa-code entity-navigation-icon';
  }
}