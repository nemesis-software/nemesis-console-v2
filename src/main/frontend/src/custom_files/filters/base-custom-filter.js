import React, { Component } from 'react';

import _ from 'lodash';
import FilterBuilder from '../../app/services/filter-builder';


export default class BaseCustomFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {appliedFilters: []};
  }

  render() {
    return (
    <div>Override!!!</div>
    )
  }

  onFilterChange(filterObject) {
    let filterIndex = _.findIndex(this.state.appliedFilters, {id: filterObject.id});
    let appliedFilters = this.state.appliedFilters;

    if (filterIndex < 0) {
      appliedFilters.push(filterObject);
    } else {
      appliedFilters[filterIndex] = filterObject;
    }

    this.setState({appliedFilters: appliedFilters});
  }

  onSearchButtonClick() {
    let filterString = FilterBuilder.buildFilter(this.state.appliedFilters);
    this.props.onFilterApply(filterString);
  }

}
