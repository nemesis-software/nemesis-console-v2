import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import FilterBooleanField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-boolean-field/filter-boolean-field'
import BaseCustomFilter from './base-custom-filter';

export default class TransactionFilter extends BaseCustomFilter {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style}>
        <FilterBooleanField readOnly={true} defaultValue={'false'} onFilterChange={this.onFilterChange.bind(this)} filterItem={{name: 'active', fieldLabel: 'Active'}} />
        <div style={{padding: '10px 0'}} ><RaisedButton style={{margin: '10px'}} label="Search" onClick={this.onSearchButtonClick.bind(this)} /></div>
      </div>
    )
  }
}
