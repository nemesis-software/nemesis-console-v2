import React, { Component } from 'react';

import FilterHelper from 'servicesDir/filter-helper';

import {nemesisFieldTypes, searchRestrictionTypes} from "../../../../../../types/nemesis-types";
import {componentRequire} from "../../../../../../utils/require-util";
import NestedFilterPopup from "../nested-filter-popup/nested-filter-popup";

const restrictionFields = [
  searchRestrictionTypes.any,
  // searchRestrictionTypes.all,
  searchRestrictionTypes.count
];

const secondRestrictionFields = [
  searchRestrictionTypes.equals,
  searchRestrictionTypes.lessThan,
  searchRestrictionTypes.greaterThan
];

let FilterItemRenderer = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-item-renderer', 'filter-item-renderer');
let NemesisEntityField = componentRequire('app/components/field-components/nemesis-entity-field/nemesis-entity-field', 'nemesis-entity-field');
let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let NemesisNumberField = componentRequire('app/components/field-components/nemesis-number-field/nemesis-number-field', 'nemesis-number-field');



export default class FilterCollectionField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: props.defaultRestriction || null, secondRestrictionField: null, selectedEntity: props.defaultValue || null, openNestedFilterPopup: false, nestedFilters: null};
  }

  render() {
    if (!this.state.nestedFilters) {
      return (
        <div className="filter-item-container">
          <FilterRestrictionFields readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction || this.state.restrictionField} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} restrictionFields={restrictionFields}/>
          {this.state.restrictionField !== searchRestrictionTypes.count ?
            <React.Fragment>
              <NemesisEntityField readOnly={this.props.readOnly || !this.state.restrictionField} value={this.state.selectedEntity} entityId={this.props.filterItem.entityId}
                              onValueChange={this.onSelectedMenuItem.bind(this)} label={this.props.filterItem.fieldLabel}/>
              {!this.props.hideNestedIcon ? <i className={'material-icons nested-filter-icon'} onClick={this.openNestedFilterPopup.bind(this)}>navigate_next</i> : false}
              {this.getNestedFilterFunctionality()}
            </React.Fragment>
            :
            <React.Fragment>
                <FilterRestrictionFields readOnly={this.props.readOnly} label={'Count'} onRestrictionFieldChange={this.onSecondRestrictionFieldChange.bind(this)} restrictionFields={secondRestrictionFields}/>
                <NemesisNumberField readOnly={this.props.readOnly || !this.state.secondRestrictionField} value={this.state.numberField} step={1} onValueChange={this.onSelectedMenuItem.bind(this)} label={'Count'}/>
            </React.Fragment>
          }
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
    this.updateParentFilter(this.state.selectedEntity, restrictionValue, this.state.secondRestrictionField);
  }

  onSecondRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, secondRestrictionField: restrictionValue});
    this.updateParentFilter(this.state.selectedEntity, this.state.restrictionField, restrictionValue);
  }

  updateParentFilter(selectedEntity, restrictionValue, secondRestrictionValue) {
    if (restrictionValue === searchRestrictionTypes.count) {
      this.props.onFilterChange({
        value: selectedEntity,
        restriction: restrictionValue,
        secondRestriction: secondRestrictionValue,
        field: this.props.filterItem.name,
        id: this.props.filterItem.name,
        textRepresentation: this.getTextRepresentation(this.props.filterItem.name, restrictionValue, selectedEntity, secondRestrictionValue)
      });
    } else {
      this.props.onFilterChange({
        value: _.isEmpty(selectedEntity) ? null : `${selectedEntity.id}`,
        restriction: restrictionValue,
        field: this.props.filterItem.name.replace('entity-', ''),
        id: this.props.filterItem.name,
        textRepresentation: this.getTextRepresentation(selectedEntity && selectedEntity.entityName, restrictionValue, this.getItemText(selectedEntity))
      });
    }

  }

  getNestedFilterFunctionality() {
    if (this.state.openNestedFilterPopup) {
      return (<NestedFilterPopup openNestedFilterPopup={this.state.openNestedFilterPopup}
                                 onNestedFilterApply={this.onNestedFilterApply.bind(this)}
                                 nestedFilters={this.state.nestedFilters || [{...this.props.filterItem}]}
                                 onModalCancel={this.closeNestedFilterPopup.bind(this)}/>)
    }
    return false;
  }

  onFilterChange(actualFilterItem) {
    this.props.onFilterChange({...actualFilterItem, id: this.props.filterItem.name, nestedFilters: [...this.state.nestedFilters.slice(0, -1)]});
  }

  getNestedFilterItemsText() {
    return [...this.state.nestedFilters.slice(0, -1)].map(item => item.fieldLabel).join(' / ');
  }

  onSelectedMenuItem(item) {
    this.setState({...this.state, selectedEntity: item});
    this.updateParentFilter(item, this.state.restrictionField, this.state.secondRestrictionField);
  }

  onNestedFilterApply(nestedFilters) {
    this.setState({nestedFilters: nestedFilters, openNestedFilterPopup: false});
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

  getTextRepresentation(name, restrictionValue, value, secondRestrictionValue) {
    return FilterHelper.getFilterFieldTextRepresentation(name, restrictionValue, value, secondRestrictionValue);
  }

  openNestedFilterPopup() {
    this.setState({openNestedFilterPopup: true});
  }

  closeNestedFilterPopup() {
    this.setState({openNestedFilterPopup: false});
  }
}