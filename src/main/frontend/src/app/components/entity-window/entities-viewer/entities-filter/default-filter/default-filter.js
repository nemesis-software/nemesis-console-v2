import React, { Component } from 'react';

import Translate from 'react-translate-component';

import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import _ from 'lodash';

import { componentRequire } from '../../../../../utils/require-util';
import { nemesisFieldTypes } from '../../../../../types/nemesis-types';

let FilterTextField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-text-field/filter-text-field', 'filter-text-field');
let FilterDateField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-date-field/filter-date-field', 'filter-date-field');
let FilterLocalizedTextField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-localized-text-field/filter-localized-text-field', '');
let FilterBooleanField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-boolean-field/filter-boolean-field', 'filter-boolean-field');
let FilterNumberField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-number-field/filter-number-field', 'filter-number-field');
let FilterEnumField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-enum-field/filter-enum-field', 'filter-enum-field');
let FilterEntityField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-entity-field/filter-entity-field', 'filter-entity-field');
let FilterBuilder = componentRequire('app/services/filter-builder', 'filter-builder');

const keyPrefix = 'defaultFilter';

export default class DefaultFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {appliedFilters: [], key: keyPrefix + Date.now()};
  }

  render() {
    return (
      <div style={this.props.style} key={this.state.key}>
        {this.props.filterMarkup.map((filterItem, index) => {
          return (
            <div key={index}>
              {this.getFilterItemRender(filterItem)}
              <Divider />
            </div>
          )
        })}
        <div style={{padding: '10px 0'}} ><RaisedButton style={{margin: '10px'}} label={<Translate component="span" content={'main.Search'} fallback={'Search'} />} onClick={this.onSearchButtonClick.bind(this)} /><RaisedButton label={<Translate component="span" content={'main.Clear'} fallback={'Clear'} />} onClick={this.onClearButtonClick.bind(this)} /></div>
      </div>
    )
  }

  getFilterItemRender(filterItem) {
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
      default: return <div>Not supported yet - {filterItem.xtype}</div>
    }

    return React.createElement(reactElement, {
      onFilterChange: this.onFilterChange.bind(this),
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
    let filterString = FilterBuilder.buildFilter(this.state.appliedFilters);
    this.props.onFilterApply(filterString);
  }

  onClearButtonClick() {
    this.setState({appliedFilters: [], key: keyPrefix + Date.now()});
    this.props.onFilterApply();
  }
}