import React, { Component } from 'react';
import FilterRestrictionFields from '../filter-restriction-field/filter-restriction-field';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import LanguageChanger from '../../../../language-changer';
import { searchRestrictionTypes } from '../../../../../types/nemesis-types';
import _ from 'lodash';

const restrictionFields = [
  searchRestrictionTypes.startingWith,
  searchRestrictionTypes.endingWith,
  searchRestrictionTypes.contains,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

const translationLanguages = {
  languages: [
    {value: 'en', labelCode: 'English'},
    {value: 'bg_BG', labelCode: 'Bulgarian'},
  ],
  defaultLanguage: {value: 'en', labelCode: 'English'}
};

const styles = {
  verticalAlign: 'top',
  marginRight: '10px'
};

export default class FilterLocalizedTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: null, textField: null, selectedLanguage: translationLanguages.defaultLanguage.value};
  }

  render() {
    return (
      <div>
        <FilterRestrictionFields onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <LanguageChanger
          label="language"
          style={this.getTextFieldStyles()}
          onLanguageChange={this.onLanguageChange.bind(this)}
          availableLanguages={translationLanguages.languages}
          selectedLanguage={translationLanguages.defaultLanguage}
        />
        <TextField style={this.getTextFieldStyles()}
                   floatingLabelText={<Translate content={'main.' + this.props.filterItem.fieldLabel} fallback={this.props.filterItem.fieldLabel} />}
                   onChange={_.debounce(this.onTextFieldChange.bind(this), 250)}/>
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.textField, restrictionValue, this.state.selectedLanguage);
  }

  onTextFieldChange(event, value) {
    this.setState({...this.state, textField: value});
    this.updateParentFilter(value, this.state.restrictionField, this.state.selectedLanguage);
  }

  onLanguageChange(language) {
    this.setState({...this.state, selectedLanguage: language});
    this.updateParentFilter(this.state.textField, this.state.restrictionField, language);
  }

  updateParentFilter(textField, restrictionValue, language) {
    this.props.onFilterChange({
      value: _.isEmpty(textField) ? null : `'${textField}'`,
      restriction: restrictionValue,
      field: `${this.props.filterItem.name}/${language}/value`,
      id: this.props.filterItem.name
    });
  }

  getTextFieldStyles() {
    let result = {...styles};
    if ([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1) {
      result.display = 'none';
    }

    return result;
  }
}