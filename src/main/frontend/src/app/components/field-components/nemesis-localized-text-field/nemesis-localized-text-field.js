import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import LanguageChanger from '../../language-changer';
import PropTypes from 'prop-types';
import {nemesisFieldUsageTypes} from '../../../types/nemesis-types';
import {Modal} from 'react-bootstrap';

export default class NemesisLocalizedTextField extends NemesisBaseField {
  constructor(props, context) {
    super(props, context);
    let defaultLanguage = (this.props.defaultLanguage && this.props.defaultLanguage.value) || context.markupConfig.defaultLanguage.value;
    this.state = {...this.state, selectedLanguage: defaultLanguage, markupConfig: context.markupConfig,openTranslateDialog: false};
  }

  render() {
    return (
      <div className="entity-field-container">
        <LanguageChanger
          readOnly={this.props.readOnly}
          label="language"
          showLabel={this.props.showLabel}
          selectClassName="entity-field"
          style={{marginRight: '15px', ...this.props.style}}
          onLanguageChange={this.onLanguageChange.bind(this)}
          availableLanguages={this.state.markupConfig.languages}
          selectedLanguage={this.props.defaultLanguage || this.state.markupConfig.defaultLanguage}
        />
        <div className="entity-field-input-container">
        {this.props.showLabel &&  <div>
            <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label}/>{this.props.required ?
            <span className="required-star">*</span> : false}
            </div>
            }
          <input type="text"
                 style={{height: '36px'}}
                 className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                 value={this.getTextFieldValue(this.state.selectedLanguage)}
                 disabled={this.props.readOnly}
                 onChange={(e) => this.onTextChange(e, e.target.value, this.state.selectedLanguage)}/>
        </div>
        {this.props.type === nemesisFieldUsageTypes.edit ?
          (
            <i className={this.getOpenDialogIconClass()} onClick={this.handleTranslateIconClick.bind(this)}/>
          ) :
          false}
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        {this.props.type === nemesisFieldUsageTypes.edit ?
          (
            <Modal show={this.state.openTranslateDialog}
                   animation={false}
                   size="lg"
                   onHide={this.handleTranslateDialogClose.bind(this)}
                   backdrop="static">
              <Modal.Header>
                <Modal.Title>Translate field</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.state.markupConfig.languages.map(this.getDialogInputField.bind(this))}
              </Modal.Body>
              <Modal.Footer>
                <button className="nemesis-button success-button"
                        onClick={this.handleTranslateDialogClose.bind(this)}>Done</button>
              </Modal.Footer>
            </Modal>
          ) :
          false}
      </div>
    )
  }

  getDialogInputField(language, index) {
    return (
      <div key={index} style={{marginBottom: '20px'}}>
        <Translate component="label" content={'main.' + language.labelCode} fallback={language.labelCode}/>
        <textarea className="entity-field form-control"
                  rows={1}
                  style={{resize: 'vertical'}}
                  value={this.getTextFieldValue(language.value)}
                  disabled={this.props.readOnly}
                  onChange={(e) => this.onTextChange(e, e.target.value, language.value)}/>
      </div>
    )
  }

  getModalSize() {
    return null;
  }

  onLanguageChange(language) {
    this.setState({...this.state, selectedLanguage: language}, () => {
      if (this.props.onValueChange) {
        this.props.onValueChange(this.getFormattedValue(this.state.value || {}, language));
      }
    });
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
    this.setState({...this.state, openTranslateDialog: true});
  };

  handleTranslateDialogClose = () => {
    this.setState({...this.state, openTranslateDialog: false});
  };

  getOpenDialogIconClass() {
    return 'fa fa-globe entity-navigation-icon entity-navigation-icon';
  }

}

NemesisLocalizedTextField.contextTypes = {
  markupConfig: PropTypes.object,
  markupData: PropTypes.object
};

NemesisLocalizedTextField.defaultProps = {
  showLabel: true
}
