import React, { Component } from 'react';

import _ from 'lodash';

import { componentRequire } from '../../../../../../utils/require-util';
import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';

let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let NemesisTextField = componentRequire('app/components/field-components/nemesis-text-field/nemesis-text-field', 'nemesis-text-field');

const restrictionFields = [
  searchRestrictionTypes.startingWith,
  searchRestrictionTypes.endingWith,
  searchRestrictionTypes.contains,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

export default class FilterTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: props.defaultRestriction || null, textField: props.defaultValue || null};
  }

  componentWillMount() {
    if (this.props.defaultRestriction || this.props.defaultValue) {
      this.updateParentFilter(this.props.defaultValue, this.props.defaultRestriction)
    }
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} restrictionFields={restrictionFields}/>
        {this.isTextFieldVisible() ? <NemesisTextField readOnly={this.props.readOnly || !this.state.restrictionField} value={this.state.textField} onValueChange={this.onTextFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/> : false}
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.textField, restrictionValue);
  }

  onTextFieldChange(value) {
    this.setState({...this.state, textField: value});
    this.updateParentFilter(value, this.state.restrictionField);
  }

  updateParentFilter(textField, restrictionValue) {
    this.props.onFilterChange({
      value: _.isEmpty(textField) ? null : `'${textField}'`,
      restriction: restrictionValue,
      field: this.props.filterItem.name,
      id: this.props.filterItem.name
    });
  }

  isTextFieldVisible() {
    return !([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1);
  }
}