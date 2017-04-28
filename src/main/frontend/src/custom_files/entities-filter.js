import React from 'react';

import EntitiesFilters from '../app/components/entity-window/entities-viewer/entities-filter/entities-filter';
import CustomFilter from './filters/new-custom-filter';
import BatchFilter from './filters/batch-filter';
import ProductFilter from './filters/active-product-filter';
import TransactionFilter from './filters/transaction-filter';

export default class CustomFilters extends EntitiesFilters {
  constructor(props) {
    super(props);
  }

  getFilters() {
    let filters = super.getFilters();
    if (this.props.entity.entityId === 'category') {
      filters.push({filterName: 'Custom filter', filterClass: CustomFilter});
    }

    if (this.props.entity.entityId === 'batch_step_execution') {
      filters.push({filterName: 'Batch filter', filterClass: BatchFilter});
    }

    if (this.props.entity.entityId === 'payment_transaction') {
      filters.push({filterName: 'Transaction filter', filterClass: TransactionFilter});
    }

    if (this.props.entity.entityId === 'product') {
      filters.push({filterName: 'Active product filter', filterClass: ProductFilter});
    }

    return filters;
  }
}
