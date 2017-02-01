import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Translate from 'react-translate-component';

export default class LanguageChanger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: this.props.selectedLanguage,
      availableLanguages: this.props.availableLanguages
    };
  }

  handleChange(event, index, value) {
    this.setState({...this.state, selectedLanguage: this.state.availableLanguages[index]});
    this.props.onLanguageChange(value);
  }

  render() {
    return (
      <SelectField
        style={this.props.style}
        value={this.state.selectedLanguage.value}
        floatingLabelText={this.props.label ? <Translate content={'main.' + this.props.label} fallback={this.props.label} /> : null}
        onChange={this.handleChange.bind(this)}>
        {this.state.availableLanguages.map((language, index) => <MenuItem key={index} value={language.value} primaryText={language.labelCode} />)}
      </SelectField>
    );
  }
}