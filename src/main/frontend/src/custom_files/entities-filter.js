import React from 'react';
import EntitiesFilters from '../app/components/entity-window/entities-viewer/entities-filter/entities-filter';
import CustomFilter from './filters/new-custom-filter';

export default class CustomFilters extends EntitiesFilters {
  constructor(props) {
    super(props);
  }

  getFilters() {
    let filters = super.getFilters();
    filters.push({filterName: 'Custom filter', filterClass: CustomFilter});
    return filters
  }
}
