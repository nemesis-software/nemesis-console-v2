import React, {Component} from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import {componentRequire} from '../../../../../utils/require-util';
import {nemesisFieldTypes, searchRestrictionTypes} from '../../../../../types/nemesis-types';

import SelectCustomArrow from '../../../../helper-components/select-custom-arrow';
import FilterItemRenderer from "../filter-fields/filter-item-renderer";
import PropTypes from "prop-types";

let FilterBuilder = componentRequire('app/services/filter-builder', 'filter-builder');

const keyPrefix = 'defaultFilter';

export default class DefaultFilter extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      appliedFilters: [],
      key: keyPrefix + Date.now(),
      filterItems: this.getInitialFilterItems(),
      appliedFilterText: [], 
      isSmallView: false,
      filterOperation: 'and'
      };
  }

  render() {
    return (
      <div style={this.props.style} key={this.state.key} className="default-filter">
        {this.state.isSmallView ? <div style={{paddingBottom: '20px'}}>
          <label>Applied Filter: </label>
          <div>{this.state.appliedFilterText.length !== 0 ? this.state.appliedFilterText : <div><i>Filter is empty</i></div>}</div>
        </div> : false}
        <form onSubmit={e => e.preventDefault()} style={this.state.isSmallView ? {display: 'none'} : {}}>
                {this.getFilterItemRender()}
                {this.state.filterItems.length !== this.props.filterMarkup.length ? <div className="add-field-container">
            <Translate component="label" content={'main.addFilterField'} fallback={'Add filter field'}/>

            <Select cache={false}
                    style={{width: '265px'}}
                    className="select-filter"
                    arrowRenderer={() => <SelectCustomArrow/>}
                    clearable={false}
                    disabled={this.props.readOnly}
                    onChange={this.onAddFieldSelected}
                    options={this.getRemainingFields()}/>
            <hr className="line"/>
          </div> : false}
          <div className="default-filter-buttons-container">
            <button className="btn btn-default default-filter-button search-button" onClick={this.onSearchButtonClick}>
              <Translate component="span" content={'main.Search'} fallback={'Search'}/>
            </button>
            <button type="button" className="btn btn-default default-filter-button clear-button" onClick={this.onClearButtonClick} ><Translate
              component="span" content={'main.Clear'} fallback={'Clear'}/></button>
            <div className="filter-operation-container">
              <div><em>Filter operator</em></div>
              <div className="filter-operation-type">
                <div className="filter-operation-type-text" onClick={this.switchFilterOperation}>{this.state.filterOperation  === 'and' ? 'AND' : 'OR'}</div>
              </div>
            </div>
          </div>
        </form>
        <div onClick={() => this.setState({isSmallView: !this.state.isSmallView})} className="filter-resize-icon paper-box with-hover"><i className={'material-icons' + (this.state.isSmallView ? ' reversed' : '')}>keyboard_arrow_up</i></div>
      </div>
    )
  }

  getFilterItemRender = () => {
   return this.state.filterItems.map((filterItem, index) => {
      return (
        <div key={filterItem.key || index}>
            <div className="filter-item-removable">
              <FilterItemRenderer
                  filterItemKey={filterItem.key}
                  filterItem={filterItem} 
                  onFilterChange={this.onFilterChange}
                />
              <i className="material-icons delete-criteria" onClick={() => this.removeFilterItem(filterItem)}>close</i>
            </div>
          <hr className="line"/>
        </div>
      )
    })
  }

  onFilterChange = (filterObject) => {
    let appliedFiltersArr = this.state.appliedFilters.slice(0);
    const itemToUpdateIndex = appliedFiltersArr.findIndex(item => item.filterItemKey === filterObject.filterItemKey);

    if (itemToUpdateIndex < 0) {
      appliedFiltersArr.push(filterObject);
     } else {
      appliedFiltersArr[itemToUpdateIndex] = filterObject;
     }

    this.setState({appliedFilters: appliedFiltersArr});
  }

  onSearchButtonClick = () => {
  const filtersToApply = this.state.appliedFilters.filter(x => x.value !==null);

    let filterString = FilterBuilder.buildFilter(filtersToApply, this.state.filterOperation, this.context.globalFiltersCatalogs);
    let appliedFilterText = filtersToApply.map(item => item.textRepresentation ? item.textRepresentation : false);
    this.setState({appliedFilterText: appliedFilterText}, () => {
      this.props.onFilterApply(filterString);
    });
  }

  onClearButtonClick = () => {
    this.setState({appliedFilters: [], key: keyPrefix + Date.now(), appliedFilterText: []});
    let filterString = FilterBuilder.buildFilter([], null, this.context.globalFiltersCatalogs);
    this.props.onFilterApply(filterString);
  }

  getInitialFilterItems = () => {
    return _.filter(this.props.filterMarkup, item => {
      return item.name === 'code' || item.name === 'catalogVersion';
    });
  }

  onAddFieldSelected = (item) => {

    let filterItems = this.state.filterItems;
    filterItems.push({key:item.key, ...item.value});

    this.setState({filterItems: filterItems});
  }

  getRemainingFields = () => {
    const result = this.props.filterMarkup.map(item => ({
        key: uuidv4(),
        value: item, 
        label: <Translate component="div" content={'main.' + item.name.replace('entity-', '')} fallback={item.name.replace('entity-', '')}/>
      })
    );
    return result;
  }

  switchFilterOperation = () => {
    this.setState({filterOperation: this.state.filterOperation === 'and' ? 'or' : 'and'});
  }

  removeFilterItem = (filterItem) => { 
    const newFilteritems = this.state.filterItems.filter(filter =>  filter.key !== filterItem.key);
    const newAppliedFilters = this.state.appliedFilters.filter(item => item.filterItemKey !== filterItem.key && item.value !== null);

    this.setState(prevState => ({
      ...prevState,
       filterItems: newFilteritems,
       appliedFilters: newAppliedFilters}));
  }
}

DefaultFilter.contextTypes = {
  globalFiltersCatalogs: PropTypes.array
};