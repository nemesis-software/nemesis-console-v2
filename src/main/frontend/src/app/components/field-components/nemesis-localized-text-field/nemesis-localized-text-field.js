import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import LanguageChanger from '../../language-changer';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';

const translationLanguages = {
  languages: [
    {value: 'en', labelCode: 'English'},
    {value: 'bg_BG', labelCode: 'Bulgarian'},
  ],
  defaultLanguage: {value: 'en', labelCode: 'English'}
};

export default class NemesisLocalizedTextField extends NemesisBaseField {
  constructor(props) {
    super(props);

    this.state = {...this.state, selectedLanguage: translationLanguages.defaultLanguage.value};
  }

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <LanguageChanger
          label="language"
          style={this.props.style}
          onLanguageChange={this.onLanguageChange.bind(this)}
          availableLanguages={translationLanguages.languages}
          selectedLanguage={translationLanguages.defaultLanguage}
        />
        <TextField style={this.props.style}
                   value={this.getTextFieldValue()}
                   disabled={this.props.readOnly}
                   floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                   onChange={this.onTextChange.bind(this)}/>
      </div>
    )
  }

  onLanguageChange(language) {
    this.setState({...this.state, selectedLanguage: language});
    if (this.props.onValueChange) {
      this.props.onValueChange(this.getFormattedValue(this.state.value || {}, language));
    }
  }

  getTextFieldValue() {
    if (!this.state.value) {
      return '';
    }

    return (this.state.value[this.state.selectedLanguage] && this.state.value[this.state.selectedLanguage].value) || '';
  }

  onTextChange(event, value) {
    let actualValue = {...this.state.value};
    actualValue[this.state.selectedLanguage].value = value;
    this.onValueChange(event, actualValue);
  }

  getFormattedValue(value, language) {
    let languageActual = language || this.state.selectedLanguage;
    if (this.props.type !== nemesisFieldUsageTypes.edit) {
      let result = {};
      result.language = languageActual;
      result.value = value[languageActual];
      return result;
    }

    return value;
  }

}