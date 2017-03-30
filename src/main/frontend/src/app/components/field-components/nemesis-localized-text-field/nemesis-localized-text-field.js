import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import LanguageChanger from '../../language-changer';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

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
    let defaultLanguage = (this.props.defaultLanguage && this.props.defaultLanguage.value) || translationLanguages.defaultLanguage.value;
    this.state = {...this.state, selectedLanguage: defaultLanguage, openTranslateDialog: false};
  }

  render() {
    const actions = [
      <FlatButton
        label="Done"
        primary={true}
        onTouchTap={this.handleTranslateDialogClose.bind(this)}
      />
    ];

    return (
      <div className="entity-field-container">
        <LanguageChanger
          label="language"
          style={this.props.style}
          onLanguageChange={this.onLanguageChange.bind(this)}
          availableLanguages={translationLanguages.languages}
          selectedLanguage={this.props.defaultLanguage || translationLanguages.defaultLanguage}
        />
        <TextField className="entity-field"
                   style={this.props.style}
                   value={this.getTextFieldValue(this.state.selectedLanguage)}
                   disabled={this.props.readOnly}
                   errorText={this.state.errorMessage}
                   floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                   onChange={(e, v) => this.onTextChange(e, v, this.state.selectedLanguage)}/>
        {this.props.type === nemesisFieldUsageTypes.edit ?
          (
            <i className="material-icons entity-navigation-icon" onClick={this.handleTranslateIconClick.bind(this)}>translate</i>
          ) :
          false}
        {this.props.type === nemesisFieldUsageTypes.edit ?
          (
            <Dialog
              title="Translate field"
              actions={actions}
              modal={true}
              open={this.state.openTranslateDialog}
            >
              {translationLanguages.languages.map(this.getDialogInputField.bind(this))}
            </Dialog>
          ) :
          false}
      </div>
    )
  }

  getDialogInputField(language, index) {
    return (
      <div key={index}>
        <TextField style={{width: '100%'}}
                   value={this.getTextFieldValue(language.value)}
                   disabled={this.props.readOnly}
                   floatingLabelText={language.labelCode}
                   onChange={(e, v) => this.onTextChange(e, v, language.value)}/>
      </div>
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
    if (this.props.type !== nemesisFieldUsageTypes.edit) {
      let result = {};
      result.language = languageActual;
      result.value = value[languageActual] && value[languageActual].value;
      return result;
    }

    return value;
  }

  handleTranslateIconClick = () => {
    this.setState({...this.state, openTranslateDialog: true });
  };

  handleTranslateDialogClose = () => {
    this.setState({...this.state, openTranslateDialog: false });
  };

}