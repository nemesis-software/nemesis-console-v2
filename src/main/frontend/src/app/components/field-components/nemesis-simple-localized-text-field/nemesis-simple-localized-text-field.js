import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';

const translationLanguages = {
  languages: [
    {value: 'en', labelCode: 'English'},
    {value: 'bg_BG', labelCode: 'Bulgarian'},
  ],
  defaultLanguage: {value: 'en', labelCode: 'English'}
};

export default class NemesisSimpleLocalizedTextField extends NemesisBaseField {
  constructor(props) {
    super(props);
    let defaultLanguage = (this.props.defaultLanguage && this.props.defaultLanguage.value) || translationLanguages.defaultLanguage.value;
    this.state = {...this.state, selectedLanguage: defaultLanguage, openTranslateDialog: false};
  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />{this.props.required ? <span className="required-star">*</span> : false}</div>
          {this.getInputField()}
        </div>
      </div>
    )
  }

  getInputField() {
    return (
      <input type="text"
             style={{height: '36px'}}
             className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
             value={this.getTextFieldValue(this.state.selectedLanguage)}
             disabled={this.props.readOnly}
             onChange={(e) => this.onTextChange(e, e.target.value, this.state.selectedLanguage)}/>
    )
  }

  onLanguageChange(language) {
    this.setState({...this.state, selectedLanguage: language});
    if (this.props.onValueChange) {
      this.props.onValueChange(this.getFormattedValue(this.state.value || {}, language));
    }
  }

  getTextFieldValue(language) {
    if (!this.state.value) {
      return '';
    }

    return (this.state.value[language] && this.state.value[language].value) || '';
  }

  onTextChange(event, value, language) {
    let actualValue = {...this.state.value};
    if (!actualValue[language]) {
      actualValue[language] = {};
    }
    actualValue[language].value = value;
    this.onValueChange(event, actualValue);
  }

  getFormattedValue(value, language) {
    let languageActual = language || this.state.selectedLanguage;
    if (this.props.type !== nemesisFieldUsageTypes.edit && this.props.type !== nemesisFieldUsageTypes.quickView) {
      let result = {};
      result.language = languageActual;
      result.value = value[languageActual] && value[languageActual].value;
      return result;
    }

    return value;
  }
}