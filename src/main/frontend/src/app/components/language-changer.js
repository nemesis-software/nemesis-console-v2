import React, { Component } from 'react';
import Translate from 'react-translate-component';

export default class LanguageChanger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: this.props.selectedLanguage,
      availableLanguages: this.props.availableLanguages
    };
  }

  handleChange(event) {
    let selectedLanguage = this.state.availableLanguages[event.target.selectedIndex];
    this.setState({...this.state, selectedLanguage: selectedLanguage});
    this.props.onLanguageChange(selectedLanguage.value);
  }

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {this.props.label ? <label><Translate content={'main.' + this.props.label} fallback={this.props.label} /></label> : false}
        <select defaultValue={this.props.selectedLanguage.value} className="form-control" onChange={this.handleChange.bind(this)} disabled={this.props.readOnly}>
          {this.state.availableLanguages.map(this.getOptionFields.bind(this))}
        </select>
      </div>
    );
  }

  getOptionFields(language, index) {
    return <option key={index} value={language.value}>{language.labelCode}</option>;
  }
}