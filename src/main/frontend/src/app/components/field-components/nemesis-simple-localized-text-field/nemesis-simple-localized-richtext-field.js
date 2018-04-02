import React from 'react';
import NemesisSimpleLocalizedTextField from './nemesis-simple-localized-text-field';

import { componentRequire } from '../../../utils/require-util';
let HtmlEditor = componentRequire('app/custom-components/html-editor/html-editor', 'html-editor');

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