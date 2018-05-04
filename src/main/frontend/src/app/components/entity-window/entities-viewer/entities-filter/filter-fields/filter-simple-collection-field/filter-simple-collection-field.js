import React, { Component } from 'react';

import FilterHelper from 'servicesDir/filter-helper';

import {searchRestrictionTypes} from "../../../../../../types/nemesis-types";
import {componentRequire} from "../../../../../../utils/require-util";

let FilterItemRenderer = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-item-renderer', 'filter-item-renderer');

let NemesisEntityField = componentRequire('app/components/field-components/nemesis-entity-field/nemesis-entity-field', 'nemesis-entity-field');

const restrictionFields = [
  searchRestrictionTypes.any,
  searchRestrictionTypes.all
];


export default class FilterCollectionField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: searchRestrictionTypes.any, selectedEntity: props.defaultValue || null};
  }

  render() {

    if (!this.state.nestedFilters) {
      return (
        <div className="filter-item-container">
          <NemesisEntityField readOnly={this.props.readOnly} value={this.state.selectedEntity} entityId={this.props.filterItem.entityId}
                              onValueChange={this.onSelectedMenuItem.bind(this)} label={this.props.filterItem.fieldLabel}/>
          {!this.props.hideNestedIcon ? <i className={'material-icons nested-filter-icon'} onClick={this.openNestedFilterPopup.bind(this)}>navigate_next</i> : false}
          {this.getNestedFilterFunctionality()}
        </div>
      )
    } else {
      if (!FilterItemRenderer) {
        FilterItemRenderer = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-item-renderer', 'filter-item-renderer');
      }
      return (
        <div className="nested-filter-renderer">
          <label>Nested Filter: {this.getNestedFilterItemsText()} <span className="edit-item" onClick={this.openNestedFilterPopup.bind(this)}>EDIT</span></label>
          <FilterItemRenderer hideNestedIcon={true} filterItem={this.state.nestedFilters[this.state.nestedFilters.length - 1]} onFilterChange={this.onFilterChange.bind(this)}/>
          {this.getNestedFilterFunctionality()}
        </div>
      )
    }
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.selectedEntity, restrictionValue);
  }

  updateParentFilter(selectedEntity, restrictionValue) {
    this.props.onFilterChange({
      value: _.isEmpty(selectedEntity) ? null : `${selectedEntity.id}`,
      restriction: restrictionValue,
      field: this.props.filterItem.name.replace('entity-', ''),
      id: this.props.filterItem.name,
      textRepresentation: this.getTextRepresentation(selectedEntity && selectedEntity.entityName, restrictionValue, this.getItemText(selectedEntity))
    });
  }

  onSelectedMenuItem(item) {
    this.setState({...this.state, selectedEntity: item});
    this.updateParentFilter(item, this.state.restrictionField);
  }


  getTextRepresentation(name, restrictionValue, value) {
    return FilterHelper.getFilterFieldTextRepresentation(name, restrictionValue, value);
  }
}