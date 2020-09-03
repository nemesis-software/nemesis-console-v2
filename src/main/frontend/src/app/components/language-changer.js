import React, { Component } from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';
import { main } from '../../locales/bg';
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
    this.setState({ ...this.state, selectedLanguage: selectedLanguage.value });
    this.props.onLanguageChange(selectedLanguage.value.value);
  }

  render() {
    const { style, label, showLabel, selectClassName, readOnly } = this.props;
    return (
      <div className="language-changer" style={{ ...style }}>
        {(showLabel && label) && <label><i className="fa fa-globe" /><Translate content={'main.' + label} fallback={label} /></label>}
        <Select
          style={{ width: '100%' }}
          clearable={false}
          className={selectClassName}
          disabled={readOnly}
          arrowRenderer={() => <SelectCustomArrow />}
          value={{ value: this.state.selectedLanguage, label: <span className="selectedLanguage"><i className="fa fa-globe"></i><span>{this.state.selectedLanguage.labelCode}</span></span> }}
          onChange={(item) => this.handleChange(item)}
          options={this.state.availableLanguages.map(this.getOptionFields.bind(this))}
        />
      </div>
    );
  }

  getOptionFields(language) {
    return { value: language, label: language.labelCode };
  }
}

LanguageChanger.defaultProps = {
  showLabel: true
}