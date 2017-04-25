import React from 'react';

import FilterBooleanField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-boolean-field/filter-boolean-field'
import FilterEntityField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-entity-field/filter-entity-field'
import BaseCustomFilter from './base-custom-filter';
import { searchRestrictionTypes } from '../../app/types/nemesis-types';

export default class TransactionFilter extends BaseCustomFilter {
  constructor(props) {
    super(props);
  }

  render() {
    let selectedCatalog = {
      catalog: 'samplestoreB2BProductCatalog',
      catalogVersion: 'samplestoreB2BProductCatalog:Staged',
      code: 'Staged',
      entityName: 'catalog_version',
      id: '565386358549216'
    };
    return (
      <div style={this.props.style}>
        <FilterBooleanField readOnly={true} defaultValue={'false'} onFilterChange={this.onFilterChange.bind(this)} filterItem={{name: 'active', fieldLabel: 'Active'}} />
        <FilterEntityField readOnly={true} defaultValue={selectedCatalog} defaultRestriction={searchRestrictionTypes.equals} onFilterChange={this.onFilterChange.bind(this)} filterItem={this.getCatalogItem()} />
        <div style={{padding: '10px 0'}} ><button className="btn btn-default" onClick={this.onSearchButtonClick.bind(this)}>Search</button></div>
      </div>
    )
  }

  getCatalogItem() {
    let transactionTypeIndex = _.findIndex(this.props.filterMarkup, {name: 'entity-catalogVersion'});
    if (transactionTypeIndex > -1) {
      return this.props.filterMarkup[transactionTypeIndex];
    }
  }
}
