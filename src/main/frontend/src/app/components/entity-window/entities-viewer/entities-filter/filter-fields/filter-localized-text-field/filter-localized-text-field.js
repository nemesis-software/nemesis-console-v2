import React, { Component } from 'react';

import _ from 'lodash';

import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';
import { componentRequire } from '../../../../../../utils/require-util';

let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let NemesisLocalizedTextField = componentRequire('app/components/field-components/nemesis-localized-text-field/nemesis-localized-text-field', 'nemesis-localized-text-field');

const restrictionFields = [
  searchRestrictionTypes.startingWith,
  searchRestrictionTypes.endingWith,
  searchRestrictionTypes.contains,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

const styles = {
  verticalAlign: 'top',
  marginRight: '10px'
};

export default class FilterLocalizedTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: null, value: {}};
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <NemesisLocalizedTextField style={this.getLocalizedFieldStyles()} onValueChange={this.onLocalizedFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.value, restrictionValue, this.state.selectedLanguage);
  }

  onLocalizedFieldChange(value) {
    this.setState({...this.state, value: value});
    this.updateParentFilter(value, this.state.restrictionField, this.state.selectedLanguage);
  }

  updateParentFilter(value, restrictionValue) {
    this.props.onFilterChange({
      value: _.isEmpty(value.value) ? null : `'${value.value}'`,
      restriction: restrictionValue,
      field: `${this.props.filterItem.name}/${value.language}/value`,
      id: this.props.filterItem.name
    });
  }

  getLocalizedFieldStyles() {
    let result = {...styles};
    if ([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1) {
      result.display = 'none';
    }

    return result;
  }
}