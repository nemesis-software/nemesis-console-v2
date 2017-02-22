import React, { Component } from 'react';
import FilterRestrictionFields from '../filter-restriction-field/filter-restriction-field';
import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';
import _ from 'lodash';
import NemesisEntityField from '../../../../../field-components/nemesis-entity-field/nemesis-entity-field';

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
    this.state = {restrictionField: null, textField: null, selectedId: null};
  }

  render() {
    return (
      <div>
        <FilterRestrictionFields label={this.props.filterItem.fieldLabel} onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <NemesisEntityField entityId={this.props.filterItem.entityId} style={this.getTextFieldStyles()} onValueChange={this.onSelectedMenuItem.bind(this)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.selectedId, restrictionValue);
  }

  updateParentFilter(selectedId, restrictionValue) {
    this.props.onFilterChange({
      value: _.isEmpty(selectedId) ? null : `${selectedId}L`,
      restriction: restrictionValue,
      field: this.props.filterItem.name.replace('entity-', '') + '/id',
      id: this.props.filterItem.name
    });
  }

  onSelectedMenuItem(item) {
    this.setState({...this.state, selectedId: item});
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