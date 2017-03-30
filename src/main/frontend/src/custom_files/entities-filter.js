import React from 'react';

import _ from 'lodash';

import EntitiesFilters from '../app/components/entity-window/entities-viewer/entities-filter/entities-filter';
import CustomFilter from './filters/new-custom-filter';
import BatchFilter from './filters/batch-filter';
import TransactionFilter from './filters/transaction-filter';

export default class CustomFilters extends EntitiesFilters {
  constructor(props) {
    super(props);
  }

  getFilters() {
    let filters = super.getFilters();
    console.log(this.props);
    if (this.props.entity.entityId === 'category') {
      filters.push({filterName: 'Custom filter', filterClass: CustomFilter});
    }

    if (this.props.entity.entityId === 'batch_step_execution') {
      filters.push({filterName: 'Batch filter', filterClass: BatchFilter});
    }

    if (this.props.entity.entityId === 'payment_transaction') {
      filters.push({filterName: 'Transaction filter', filterClass: TransactionFilter});
    }

    return filters;
  }
}
