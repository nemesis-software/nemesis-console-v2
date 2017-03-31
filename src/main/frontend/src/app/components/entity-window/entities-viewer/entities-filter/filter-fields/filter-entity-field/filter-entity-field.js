import React, { Component } from 'react';

import _ from 'lodash';

import { componentRequire } from '../../../../../../utils/require-util';
import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';

let FilterRestrictionFields = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-restriction-field/filter-restriction-field', 'filter-restriction-field');
let NemesisEntityField = componentRequire('app/components/field-components/nemesis-entity-field/nemesis-entity-field', 'nemesis-entity-field');

const restrictionFields = [
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

const styles = {
  verticalAlign: 'top',
  marginRight: '10px'
};

export default class FilterEntityField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: props.defaultRestriction || null, selectedEntity: props.defaultValue || null};
  }

  componentWillMount() {
    if (this.props.defaultRestriction || this.props.defaultValue) {
      this.updateParentFilter(this.props.defaultValue, this.props.defaultRestriction);
    }
  }

  render() {
    return (
      <div className="filter-item-container">
        <FilterRestrictionFields readOnly={this.props.readOnly} defaultValue={this.props.defaultRestriction} label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <NemesisEntityField readOnly={this.props.readOnly} value={this.state.selectedEntity} entityId={this.props.filterItem.entityId} style={this.getTextFieldStyles()} onValueChange={this.onSelectedMenuItem.bind(this)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.selectedEntity, restrictionValue);
  }

  updateParentFilter(selectedEntity, restrictionValue) {
    this.props.onFilterChange({
      value: _.isEmpty(selectedEntity) ? null : `${selectedEntity.id}L`,
      restriction: restrictionValue,
      field: this.props.filterItem.name.replace('entity-', '') + '/id',
      id: this.props.filterItem.name
    });
  }

  onSelectedMenuItem(item) {
    this.setState({...this.state, selectedEntity: item});
    this.updateParentFilter(item, this.state.restrictionField);
  }

  getTextFieldStyles() {
    let result = {...styles};
    if ([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1) {
      result.display = 'none';
    }

    return result;
  }
}