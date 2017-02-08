import React, { Component } from 'react';
import { nemesisFieldTypes } from '../../../../types/nemesis-types';
import FilterTextField from '../filter-fields/filter-text-field/filter-text-field';
import FilterDateField from '../filter-fields/filter-date-field/filter-date-field';
import FilterLocalizedTextField from '../filter-fields/filter-localized-text-field/filter-localized-text-field';
import FilterBooleanField from '../filter-fields/filter-boolean-field/filter-boolean-field';
import FilterNumberField from '../filter-fields/filter-number-field/filter-number-field';
import FilterEnumField from '../filter-fields/filter-enum-field/filter-enum-field';
import FilterEntityField from '../filter-fields/filter-enitiy-field/filter-entity-field';
import FilterBuilder from '../../../../services/filter-builder';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';

const keyPrefix = 'defaultFilter';

export default class DefaultFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {appliedFilters: [], key: keyPrefix + Date.now()};
  }

  render() {
    return (
      <div key={this.state.key}>
        {this.props.filterMarkup.map((filterItem, index) => this.getFilterItemRender(filterItem, index))}
        <RaisedButton style={{margin: '10px'}} label="Search" onClick={this.onSearchButtonClick.bind(this)} /><RaisedButton label="Clear" onClick={this.onClearButtonClick.bind(this)} />
      </div>
    )
  }

  getFilterItemRender(filterItem, renderIndex) {
    let reactElement;
    switch (filterItem.xtype) {
      case nemesisFieldTypes.nemesisTextField: reactElement = FilterTextField; break;
      case nemesisFieldTypes.nemesisDateField: reactElement = FilterDateField; break;
      case nemesisFieldTypes.nemesisLocalizedTextField: reactElement = FilterLocalizedTextField; break;
      case nemesisFieldTypes.nemesisBooleanField: reactElement = FilterBooleanField; break;
      case nemesisFieldTypes.nemesisEnumField: reactElement = FilterEnumField; break;
      case nemesisFieldTypes.nemesisIntegerField:
      case nemesisFieldTypes.nemesisDecimalField: reactElement = FilterNumberField; break;
      case nemesisFieldTypes.nemesisEntityField: reactElement = FilterEntityField; break;
      default: return <div key={renderIndex}>Not supported yet - {filterItem.xtype}</div>
    }

    return React.createElement(reactElement, {
      onFilterChange: this.onFilterChange.bind(this),
      key: renderIndex,
      filterItem: filterItem
    })
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
    console.log(this.state.appliedFilters);
    let filterString = FilterBuilder.buildFilter(this.state.appliedFilters);
    this.props.onFilterApply(filterString);
  }

  onClearButtonClick() {
    this.setState({appliedFilters: [], key: keyPrefix + Date.now()});
    this.props.onFilterApply();
  }
}