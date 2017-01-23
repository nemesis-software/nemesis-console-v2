import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  customWidth: {
    width: 200,
  }
};

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
      <DropDownMenu
        value={this.state.selectedLanguage.value}
        onChange={this.handleChange.bind(this)}
        style={styles.customWidth}
        autoWidth={false}>
        {this.state.availableLanguages.map((language, index) => <MenuItem key={index} value={language.value} primaryText={language.labelCode} />)}
      </DropDownMenu>
    );
  }
}