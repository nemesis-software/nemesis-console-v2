import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import FilterNumberField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-enum-field/filter-enum-field'
import BaseCustomFilter from './base-custom-filter';

export default class TransactionFilter extends BaseCustomFilter {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style}>
        <FilterNumberField readOnly={true} defaultValue={'AUTHORIZE'} onFilterChange={this.onFilterChange.bind(this)} filterItem={this.getTranscationItem()} />
        <div style={{padding: '10px 0'}} ><RaisedButton style={{margin: '10px'}} label="Search" onClick={this.onSearchButtonClick.bind(this)} /></div>
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
