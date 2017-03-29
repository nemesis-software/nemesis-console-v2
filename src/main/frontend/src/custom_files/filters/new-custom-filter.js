import React, { Component } from 'react';

import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';

import FilterTextField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-text-field/filter-text-field'
import { searchRestrictionTypes } from '../../app/types/nemesis-types';
import FilterBuilder from '../../app/services/filter-builder';


export default class CustomFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {appliedFilters: []};
  }

  render() {
    return (
      <div style={this.props.style}>
        <FilterTextField readOnly={true} defaultRestriction={searchRestrictionTypes.startingWith} defaultValue={'women'} onFilterChange={this.onFilterChange.bind(this)} filterItem={{name: 'code', fieldLabel: 'Code'}} />
        <div style={{padding: '10px 0'}} ><RaisedButton style={{margin: '10px'}} label="Search" onClick={this.onSearchButtonClick.bind(this)} /></div>
      </div>
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
