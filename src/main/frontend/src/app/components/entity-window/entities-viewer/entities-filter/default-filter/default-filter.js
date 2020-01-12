import React, {Component} from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';

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
    this.state = {appliedFilters: [], key: keyPrefix + Date.now(), filterItems: this.getInitialFilterItems(), appliedFilterText: [], isSmallView: false, filterOperation: 'and'};
  }

  render() {
    return (
      <div style={this.props.style} key={this.state.key} className="default-filter">
        {this.state.isSmallView ? <div style={{paddingBottom: '20px'}}>
          <label>Applied Filter: </label>
          <div>{this.state.appliedFilterText.length !== 0 ? this.state.appliedFilterText : <div><i>Filter is empty</i></div>}</div>
        </div> : false}
        <form onSubmit={e => e.preventDefault()} style={this.state.isSmallView ? {display: 'none'} : {}}>
          {this.state.filterItems.map((filterItem, index) => {
            return (
              <div key={index}>
                {this.getFilterItemRender(filterItem)}
                <hr className="line"/>
              </div>
            )
          })}
          {this.state.filterItems.length !== this.props.filterMarkup.length ? <div className="add-field-container">
            <Translate component="label" content={'main.addFilterField'} fallback={'Add filter field'}/>

            <Select cache={false}
                    style={{width: '265px'}}
                    className="select-filter"
                    arrowRenderer={() => <SelectCustomArrow/>}
                    clearable={false}
                    disabled={this.props.readOnly}
                    onChange={this.onAddFieldSelected.bind(this)}
                    options={this.getRemainingFields()}/>
            <hr className="line"/>
          </div> : false}
          <div className="default-filter-buttons-container">
            <button className="btn btn-default default-filter-button search-button" onClick={this.onSearchButtonClick.bind(this)}>
              <Translate component="span" content={'main.Search'} fallback={'Search'}/>
            </button>
            <button type="button" className="btn btn-default default-filter-button clear-button" onClick={this.onClearButtonClick.bind(this)}><Translate
              component="span" content={'main.Clear'} fallback={'Clear'}/></button>
            <div className="filter-operation-container">
              <div><em>Filter operator</em></div>
              <div className="filter-operation-type">
                <div className="filter-operation-type-text" onClick={this.switchFilterOperation.bind(this)}>{this.state.filterOperation  === 'and' ? 'AND' : 'OR'}</div>
              </div>
            </div>
          </div>
        </form>
        <div onClick={() => this.setState({isSmallView: !this.state.isSmallView})} className="filter-resize-icon paper-box with-hover"><i className={'material-icons' + (this.state.isSmallView ? ' reversed' : '')}>keyboard_arrow_up</i></div>
      </div>
    )
  }

  getFilterItemRender(filterItem) {

    let initialFilterItemsNames = this.getInitialFilterItems().map(filter => filter.name );
    if(initialFilterItemsNames.includes(filterItem.name)){
      return (<div><FilterItemRenderer filterItem={filterItem} onFilterChange={this.onFilterChange.bind(this)}/>
		   </div>);
	}
    else {
      return (<div className="filter-item-removable" ><FilterItemRenderer filterItem={filterItem} onFilterChange={this.onFilterChange.bind(this)}/>
        <i className="material-icons" onClick={this.removeFilterItem.bind(this,filterItem.name)}>close</i>
      </div>);
	}
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
    let filterString = FilterBuilder.buildFilter(this.state.appliedFilters, this.state.filterOperation, this.context.globalFiltersCatalogs);
    let appliedFilterText = this.state.appliedFilters.map(item => item.textRepresentation ? item.textRepresentation : false);
    this.setState({appliedFilterText: appliedFilterText}, () => {
      this.props.onFilterApply(filterString);
    });
  }

  onClearButtonClick() {
    this.setState({appliedFilters: [], key: keyPrefix + Date.now(), appliedFilterText: []});
    let filterString = FilterBuilder.buildFilter([], null, this.context.globalFiltersCatalogs);
    this.props.onFilterApply(filterString);
  }

  getInitialFilterItems() {
    return _.filter(this.props.filterMarkup, item => {
      return item.name === 'code' || item.name === 'catalogVersion';
    });
  }

  onAddFieldSelected(item) {

    let filterItems = this.state.filterItems;
    filterItems.push(item.value);

    this.setState({filterItems: filterItems});
  }

  getRemainingFields() {
    return _.map(_.difference(this.props.filterMarkup, this.state.filterItems), item => {
      return {value: item, label: <Translate component="div" content={'main.' + item.name.replace('entity-', '')} fallback={item.name.replace('entity-', '')}/>}
    });
  }

  switchFilterOperation() {
    this.setState({filterOperation: this.state.filterOperation === 'and' ? 'or' : 'and'});
  }
  removeFilterItem = (filterName) => {
    let updatedFilters = this.state.filterItems.filter(filter =>  filter.name !== filterName);
    this.setState(prevState => ({...prevState, filterItems:updatedFilters}));
  }
}

DefaultFilter.contextTypes = {
  globalFiltersCatalogs: PropTypes.array
};