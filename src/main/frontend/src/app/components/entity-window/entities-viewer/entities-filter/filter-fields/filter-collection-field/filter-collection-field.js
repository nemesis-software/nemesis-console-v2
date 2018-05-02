import React, { Component } from 'react';

import FilterHelper from 'servicesDir/filter-helper';

import {searchRestrictionTypes} from "../../../../../../types/nemesis-types";
import {componentRequire} from "../../../../../../utils/require-util";

let NemesisEntityField = componentRequire('app/components/field-components/nemesis-entity-field/nemesis-entity-field', 'nemesis-entity-field');


export default class FilterCollectionField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: searchRestrictionTypes.any, selectedEntity: props.defaultValue || null};
  }

  render() {
    return (
      <div className="filter-item-container">
        <NemesisEntityField readOnly={this.props.readOnly} value={this.state.selectedEntity} entityId={this.props.filterItem.entityId} onValueChange={this.onSelectedMenuItem.bind(this)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
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

  getTextRepresentation(name, restrictionValue, value) {
    return FilterHelper.getFilterFieldTextRepresentation(name, restrictionValue, value);
  }
}