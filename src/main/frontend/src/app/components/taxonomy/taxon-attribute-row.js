import React, {Component} from 'react';

const translationLanguages = {
  languages: [
    {value: 'en', labelCode: 'English'},
    {value: 'bg_BG', labelCode: 'Bulgarian'},
  ],
  defaultLanguage: {value: 'en', labelCode: 'English'}
};

export default class TaxonAttributeRow extends Component {
  constructor(props) {
    super(props);
    let defaultLanguage = (this.props.defaultLanguage && this.props.defaultLanguage.value) || translationLanguages.defaultLanguage.value;
    this.state = {...this.state, value : this.props.taxonAttribute.name, selectedLanguage: defaultLanguage};
  }

  render() {
    return (


      
      <tr>
        <td>{this.props.taxonAttribute.code}</td>
        <td>{this.getTextFieldValue(this.props.taxonAttribute.name, this.state.selectedLanguage)}</td>
        <td>{this.props.taxonAttribute.unit != null ? this.getTextFieldValue(this.props.taxonAttribute.unit.name, this.state.selectedLanguage) : ''}</td>
        <td>{this.props.taxonAttribute.type}</td>
        <td>value</td>
        <td>
            <div className="delete-icon-container" onClick={this.handleDeleteButtonClick.bind(this)}><i className="material-icons">delete_forever</i></div>
            <div className="delete-icon-container" onClick={this.handleEditButtonClick.bind(this)}><i className="material-icons">edit</i></div>
        </td>
      </tr>
    )
  }

  handleDeleteButtonClick() {
  }

  handleEditButtonClick() {

  }

    getTextFieldValue(val, language) {
      if (!this.state.value) {
        return '';
      }

      return (val[language] && val[language].value) || '';
    }

    onLanguageChange(language) {
      this.setState({...this.state, selectedLanguage: language});
      if (this.props.onValueChange) {
        this.props.onValueChange(this.getFormattedValue(this.state.value || {}, language));
      }
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
