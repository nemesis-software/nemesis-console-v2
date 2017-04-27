import React, { Component } from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';

export default class LanguageChanger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: this.props.selectedLanguage || this.props.availableLanguages[0],
      availableLanguages: this.props.availableLanguages
    };
  }

  handleChange(selectedLanguage) {
    console.log(selectedLanguage);
    this.setState({...this.state, selectedLanguage: selectedLanguage.value});
    this.props.onLanguageChange(selectedLanguage.value.value);
  }

  render() {
    return (
      <div style={{display: 'inline-block', width: '256px', verticalAlign: 'top', ...this.props.style}}>
        {this.props.label ? <label><Translate content={'main.' + this.props.label} fallback={this.props.label} /></label> : false}
        <Select style={{width: '100%'}}
                clearable={false}
                disabled={this.props.readOnly}
                value={{value: this.state.selectedLanguage, label: this.state.selectedLanguage.labelCode }}
                onChange={(item) => this.handleChange(item)}
                options={this.state.availableLanguages.map(this.getOptionFields.bind(this))}/>
      </div>
    );
  }

  getOptionFields(language) {
    return {value: language, label: language.labelCode};
  }
}