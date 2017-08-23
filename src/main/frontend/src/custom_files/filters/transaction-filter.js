import React from 'react';


import FilterEnumField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-enum-field/filter-enum-field'
import BaseCustomFilter from './base-custom-filter';

export default class TransactionFilter extends BaseCustomFilter {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style}>
        <FilterEnumField readOnly={false} defaultValue={'AUTHORIZE'} onFilterChange={this.onFilterChange.bind(this)} filterItem={this.getTranscationItem()} />
        <div style={{padding: '10px 0'}} ><button className="btn btn-default" onClick={this.onSearchButtonClick.bind(this)}>Search</button></div>
      </div>
    )
  }

  getTranscationItem() {
    let transactionTypeIndex = _.findIndex(this.props.filterMarkup, {name: 'type'});
    if (transactionTypeIndex > -1) {
      return this.props.filterMarkup[transactionTypeIndex];
    }
  }
}
