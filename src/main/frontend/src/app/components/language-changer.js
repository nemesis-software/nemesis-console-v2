import React, { Component } from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';

import SelectCustomArrow from './helper-components/select-custom-arrow';

export default class LanguageChanger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: this.props.selectedLanguage || this.props.availableLanguages[0],
      availableLanguages: this.props.availableLanguages
    };
  }

  handleChange(selectedLanguage) {
    this.setState({...this.state, selectedLanguage: selectedLanguage.value});
    this.props.onLanguageChange(selectedLanguage.value.value);
  }

  render() {

    return (
      <div className="language-changer" style={{...this.props.style}}>
        {this.props.label ? <label><i className="fa fa-globe" /><Translate content={'main.' + this.props.label} fallback={this.props.label} /></label> : false}
        <Select
            style={{width: '100%'}}
                clearable={false}
                className={this.props.selectClassName}
                disabled={this.props.readOnly}
                arrowRenderer={() => <SelectCustomArrow />}
                value={{value: this.state.selectedLanguage, label: <span className="selectedLanguage"><i className="fa fa-globe"></i><span>{this.state.selectedLanguage.labelCode}</span></span> }}
                onChange={(item) => this.handleChange(item)}
                options={this.state.availableLanguages.map(this.getOptionFields.bind(this))}
        />
      </div>
    );
  }

  getOptionFields(language) {
    return {value: language, label: language.labelCode};
  }
}
