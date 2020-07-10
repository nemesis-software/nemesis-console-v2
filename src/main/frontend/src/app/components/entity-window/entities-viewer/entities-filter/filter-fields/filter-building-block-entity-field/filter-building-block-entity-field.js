import React, { Component } from 'react';

import _ from 'lodash';

import FilterHelper from 'servicesDir/filter-helper';

import { componentRequire } from '../../../../../../utils/require-util';
import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';
import NestedFilterPopup from "../nested-filter-popup/nested-filter-popup";

let FilterItemRenderer = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-item-renderer', 'filter-item-renderer');
let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let BuildingBlockEntityField = componentRequire('app/components/field-components/nemesis-building-block-entity-field/nemesis-building-block-entity-field', 'nemesis-building-block-entity-field');

const restrictionFields = [
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

export default class FilterBuildingBlockEntityField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restrictionField: props.defaultRestriction || null,
      selectedEntity: props.defaultValue || null,
      openNestedFilterPopup: false,
      nestedFilters: null,
      newNestedFilter: null
    };
  }

  componentDidMount() {
    if (this.props.defaultRestriction || this.props.defaultValue) {
      this.updateParentFilter(this.props.defaultValue, this.props.defaultRestriction);
    }
  }

  render() {
    if (!this.state.nestedFilters) {
      return (
        <div className="filter-item-container">
          <FilterRestrictionFields readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction || this.state.restrictionField} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange} restrictionFields={restrictionFields} />
          {this.isEntityFieldVisible() ? <BuildingBlockEntityField updateNewNestedFilter={this.updateNewNestedFilter} readOnly={this.props.readOnly || !this.state.restrictionField} value={this.state.selectedEntity} entityId={this.props.filterItem.entityId} onValueChange={this.onSelectedMenuItem} label={this.props.filterItem.fieldLabel} /> : false}
          {(!this.props.hideNestedIcon && this.state.newNestedFilter) ? <i className={'material-icons nested-filter-icon'} onClick={this.openNestedFilterPopup}>navigate_next</i> : false}
          {this.getNestedFilterFunctionality()}
        </div>
      )
    } else {
      if (!FilterItemRenderer) {
        FilterItemRenderer = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-item-renderer', 'filter-item-renderer');
      }
      return (
        <div className="nested-filter-renderer">
          <label>Nested Filter: {this.getNestedFilterItemsText()} <span className="edit-item" onClick={this.openNestedFilterPopup}>EDIT</span></label>
          <FilterItemRenderer hideNestedIcon={true} filterItem={this.state.nestedFilters[this.state.nestedFilters.length - 1]} onFilterChange={this.onFilterChange} />
          {this.getNestedFilterFunctionality()}
        </div>
      )
    }
  }

  getNestedFilterFunctionality() {
    if (this.state.openNestedFilterPopup) {
      return (<NestedFilterPopup openNestedFilterPopup={this.state.openNestedFilterPopup}
        onNestedFilterApply={this.onNestedFilterApply}
        nestedFilters={this.state.nestedFilters || [{ entityId: this.state.newNestedFilter.id, fieldLabel: this.state.newNestedFilter.text }]}
        onModalCancel={this.closeNestedFilterPopup} />)
    }
    return false;
  }

  onFilterChange = (actualFilterItem) => {
    this.props.onFilterChange({ ...actualFilterItem, id: this.props.filterItem.name, nestedFilters: [...this.state.nestedFilters.slice(0, -1)] });
  }

  getNestedFilterItemsText() {
    return [...this.state.nestedFilters.slice(0, -1)].map(item => item.fieldLabel).join(' / ');
  }

  onRestrictionFieldChange = (restrictionValue) => {
    this.setState({ ...this.state, restrictionField: restrictionValue });
    this.updateParentFilter(this.state.selectedEntity, restrictionValue);
  }

  updateNewNestedFilter = (item) => {
    this.setState({
      newNestedFilter: item
    });
  }

  onNestedFilterApply = (nestedFilters) => {
    this.setState({ nestedFilters: nestedFilters, openNestedFilterPopup: false });
  }

  updateParentFilter(selectedEntity, restrictionValue) {
    const { filterItem } = this.props;
    this.props.onFilterChange({
      filterItemKey: filterItem.key,
      value: _.isEmpty(selectedEntity) ? null : `${selectedEntity.id}`,
      restriction: restrictionValue,
      field: filterItem.name.replace('entity-', '') + '/id',
      id: filterItem.name,
      textRepresentation: this.getTextRepresentation(selectedEntity && selectedEntity.entityName, restrictionValue, this.getItemText(selectedEntity))
    });
  }

  onSelectedMenuItem = (item) => {
    this.setState({ ...this.state, selectedEntity: item });
    this.updateParentFilter(item, this.state.restrictionField);
  }

  getItemText(item) {
    if (!item) {
      return '';
    }

    let text = item.code;
    if (item.entityName === 'catalog_version') {
      text = item.catalogVersion || item.code;
    } else if (item.entityName === 'cms_slot') {
      text = `${item.code} - ${item.position}`
    } else if (item.catalogVersion) {
      text = `${item.code} - ${item.catalogVersion}`
    }

    return text;
  }

  isEntityFieldVisible() {
    return !([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1);
  }

  getTextRepresentation(name, restrictionValue, value) {
    return FilterHelper.getFilterFieldTextRepresentation(name, restrictionValue, value);
  }

  openNestedFilterPopup = () => {
    this.setState({ openNestedFilterPopup: true });
  }

  closeNestedFilterPopup = () => {
    this.setState({ openNestedFilterPopup: false });
  }
}