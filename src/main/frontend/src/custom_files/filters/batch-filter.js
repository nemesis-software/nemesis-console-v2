import React from 'react';


import FilterNumberField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-number-field/filter-number-field'
import { searchRestrictionTypes } from '../../app/types/nemesis-types';
import BaseCustomFilter from './base-custom-filter';

export default class CustomFilter extends BaseCustomFilter {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style}>
        <FilterNumberField readOnly={true} defaultRestriction={searchRestrictionTypes.equals} defaultValue={2} onFilterChange={this.onFilterChange.bind(this)} filterItem={{name: 'id', fieldLabel: 'Id'}} />
        <div style={{padding: '10px 0'}} ><button className="btn btn-default" onClick={this.onSearchButtonClick.bind(this)}>Search</button></div>
      </div>
    )
  }
}
