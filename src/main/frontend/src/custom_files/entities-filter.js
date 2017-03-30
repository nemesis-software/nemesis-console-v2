import React from 'react';
import EntitiesFilters from '../app/components/entity-window/entities-viewer/entities-filter/entities-filter';
import CustomFilter from './filters/new-custom-filter';
import BatchFilter from './filters/batch-filter';

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

    return filters;
  }
}
