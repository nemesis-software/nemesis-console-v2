import React, { Component } from 'react';

import { componentRequire } from '../../../../../../utils/require-util';
import { searchRestrictionTypes, nemesisFieldTypes } from '../../../../../../types/nemesis-types';

import FilterHelper from 'servicesDir/filter-helper';

let NemesisFilterMapFieldItem = componentRequire('app/components/field-components/nemesis-map-field/nemesis-filter-map-field-item', 'nemesis-filter-map-field-item');
let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');


const restrictionFields = [
  searchRestrictionTypes.valueEquals,
  searchRestrictionTypes.valueContains,
  searchRestrictionTypes.valueStartsWith,
  searchRestrictionTypes.valueEndsWith
];

export default class FilterMapField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: props.defaultRestriction || null, mapField: props.defaultValue || null};
  }

  componentDidMount() {
    if (this.props.defaultRestriction || this.props.defaultValue) {
      this.updateParentFilter(this.props.defaultValue, this.props.defaultRestriction)
    }
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} restrictionFields={restrictionFields}/>
        {this.isMapFieldVisible() ?
        <NemesisFilterMapFieldItem readOnly={this.props.readOnly || !this.state.restrictionField} value={this.state.mapField}
        onValueChange={this.onMapFieldChange.bind(this)} item={{}}  label={this.props.filterItem.fieldLabel}/>
        : false}
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
    this.updateParentFilter(this.state.mapField, restrictionValue);
  }

  onMapFieldChange(value) {
    this.setState({...this.state, mapField: value});
    this.updateParentFilter(value, this.state.restrictionField);
  }

  updateParentFilter(mapField, restrictionValue) {
    let stringRepresentation = this.getStringRepresentation(mapField);
    const {filterItem} = this.props;

    this.props.onFilterChange({
      filterItemKey: filterItem.key,
      value: mapField,
      restriction: restrictionValue,
      field: filterItem.name,
      id: filterItem.name,
      textRepresentation: this.getTextRepresentation(filterItem.name, restrictionValue, mapField)
    });
  }


  isMapFieldVisible() {
    return !([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1);
  }

  getTextRepresentation(name, restrictionValue, value) {
    let result = FilterHelper.getFilterFieldTextRepresentation(name, restrictionValue, this.getStringRepresentation(value));
    return result;
  }

  getStringRepresentation(entry) {
      let stringRepresentation = null;
      if (entry && entry.key && entry.value) {
          stringRepresentation = entry.key + " " + entry.value;
      }
      return stringRepresentation;
  }
}
