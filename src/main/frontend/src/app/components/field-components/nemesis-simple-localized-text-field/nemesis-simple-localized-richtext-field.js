import React from 'react';
import NemesisSimpleLocalizedTextField from './nemesis-simple-localized-text-field';

import HtmlEditor from '../../../custom-components/html-editor/html-editor';

export default class NemesisSimpleLocalizedRichTextField extends NemesisSimpleLocalizedTextField {
  constructor(props) {
    super(props);
  }

  getInputField() {
    return (
      <HtmlEditor htmlContent={this.getTextFieldValue(this.state.selectedLanguage)} onChange={(value) => this.onTextChange(null, value, this.state.selectedLanguage)} />
    )
  }
}