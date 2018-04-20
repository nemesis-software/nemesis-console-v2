import React from 'react';
import Translate from 'react-translate-component';
import NemesisLocalizedTextField from './nemesis-localized-text-field';
import { componentRequire } from '../../../utils/require-util';
let HtmlEditor = componentRequire('app/custom-components/html-editor/html-editor', 'html-editor');

export default class NemesisTextField extends NemesisLocalizedTextField {
  constructor(props) {
    super(props);
  }

  getDialogInputField(language, index) {
    return (
      <div key={index} style={{marginBottom: '20px'}}>
        <Translate component="label" content={'main.' + language.labelCode} fallback={language.labelCode} />
        <HtmlEditor htmlContent={this.getTextFieldValue(language.value)} onChange={(value) => this.onTextChange(null, value, language.value)} />
      </div>
    )
  }

  getOpenDialogIconClass() {
    return 'fa fa-code entity-navigation-icon';
  }

  getModalSize() {
    return 'large';
  }
}