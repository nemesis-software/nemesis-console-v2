import React, { Component } from 'react';

import { componentRequire } from '../../../../../../utils/require-util';
import { searchRestrictionTypes, nemesisFieldTypes } from '../../../../../../types/nemesis-types';

import FilterHelper from 'servicesDir/filter-helper';

let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let NemesisMoneyField = componentRequire('app/components/field-components/nemesis-money-field/nemesis-money-field', 'nemesis-money-field');

const restrictionFields = [
  searchRestrictionTypes.greaterThan,
  searchRestrictionTypes.lessThan,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

export default class FilterMoneyField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: props.defaultRestriction || null, moneyField: props.defaultValue || null};
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} restrictionFields={restrictionFields}/>
        {this.isMoneyFieldVisible() ? <NemesisMoneyField readOnly={this.props.readOnly || !this.state.restrictionField} value={this.state.moneyField}
        onValueChange={this.onMoneyFieldChange.bind(this)}
        label={this.props.filterItem.fieldLabel}/> : false}
      </div>
    )
  }

  componentWillMount() {
    if (this.props.defaultRestriction || this.props.defaultValue) {
      this.updateParentFilter(this.props.defaultValue, this.props.defaultRestriction)
    }
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.moneyField, restrictionValue);
  }

  onMoneyFieldChange(value) {
    this.setState({...this.state, moneyField: value});
    this.updateParentFilter(value, this.state.restrictionField);
  }

  updateParentFilter(moneyField, restrictionValue) {
    let stringRepresentation = this.getStringRepresentation(moneyField);
    const {filterItem} = this.props;
    
    this.props.onFilterChange({
      filterItemKey: filterItemKey,
      value: stringRepresentation,
      restriction: restrictionValue,
      field: filterItem.name,
      id: filterItem.name,
      textRepresentation: this.getTextRepresentation(filterItem.name, restrictionValue, moneyField)
    });
  }


  isMoneyFieldVisible() {
    return !([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1);
  }

  getTextRepresentation(name, restrictionValue, value) {
    return FilterHelper.getFilterFieldTextRepresentation(name, restrictionValue, this.getStringRepresentation(value));
  }

  getStringRepresentation(money) {
      let stringRepresentation = null;
      if (money && money.amount && money.currency) {
          stringRepresentation = money.amount + " " + money.currency;
      }
      return stringRepresentation;
  }
}
