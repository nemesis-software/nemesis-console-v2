import React, { Component } from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import { componentRequire } from '../../../../../utils/require-util';
import { nemesisFieldTypes, searchRestrictionTypes } from '../../../../../types/nemesis-types';

import ApiCall from '../../../../../services/api-call';
import SelectCustomArrow from '../../../../helper-components/select-custom-arrow';
import FilterItemRenderer from "../filter-fields/filter-item-renderer";
import PropTypes from "prop-types";

let FilterBuilder = componentRequire('app/services/filter-builder', 'filter-builder');

const keyPrefix = 'defaultFilter';
const filterOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' }
]

export default class DefaultFilter extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      appliedFilters: [],
      key: keyPrefix + Date.now(),
      filterItems: this.getInitialFilterItems(),
      appliedFilterText: [],
      isSmallView: false,
      filterOperation: filterOptions[0],
      entitySubtypes: [],
      selectedEntitySubtype: {}
    };
  }

  render() {
    return (
      <div style={this.props.style} key={this.state.key} className="default-filter">
        {this.state.isSmallView ? <div style={{ paddingBottom: '20px' }}>
          <label>Applied Filter: </label>
          <div>{this.state.appliedFilterText.length !== 0 ? this.state.appliedFilterText : <div><i>Filter is empty</i></div>}</div>
        </div> : false}
        <form onSubmit={e => e.preventDefault()} style={this.state.isSmallView ? { display: 'none' } : {}}>
          {this.getFilterItemRender()}
          {this.state.filterItems.length !== this.props.filterMarkup.length ? <div className="add-field-container">
            <Translate component="label" content={'main.addFilterField'} fallback={'Add filter field'} />
            <Select cache={false}
              style={{ width: '265px' }}
              className="select-filter"
              arrowRenderer={() => <SelectCustomArrow />}
              clearable={false}
              disabled={this.props.readOnly}
              onChange={this.onAddFieldSelected}
              options={this.getRemainingFields()}
            />
            <hr className="line" />
          </div> : false}

          <div className="default-filter-buttons-container">
            <Translate component="label" content={'Entity type'} fallback={'Entity type'} />
            <Select cache={false}
              style={{ width: '265px' }}
              className="select-filter default-entity-filter-style"
              arrowRenderer={() => <SelectCustomArrow />}
              clearable={false}
              defaultOptions
              value={this.state.selectedEntitySubtype}
              disabled={this.props.readOnly}
              onChange={this.selectEntitySubtype}
              options={this.state.entitySubtypes}
            />

            <span><em>Filter operator</em></span>
            <Select cache={false}
              style={{ width: '50px' }}
              className="select-filter select-filter-operator"
              arrowRenderer={() => <SelectCustomArrow />}
              clearable={false}
              defaultOptions
              value={this.state.filterOperation}
              disabled={this.props.readOnly}
              onChange={this.switchFilterOperator}
              options={filterOptions}
            />

            <button className="btn btn-default default-filter-button search-button" onClick={this.onSearchButtonClick}>
              <Translate component="span" content={'main.Search'} fallback={'Search'} />
            </button>
            <button type="button" className="btn btn-default default-filter-button clear-button" onClick={this.onClearButtonClick} ><Translate
              component="span" content={'main.Clear'} fallback={'Clear'} /></button>
          </div>
        </form>
        <div onClick={() => this.setState({ isSmallView: !this.state.isSmallView })} className="filter-resize-icon paper-box with-hover"><i className={'material-icons' + (this.state.isSmallView ? ' reversed' : '')}>keyboard_arrow_up</i></div>
      </div>
    )
  }

  componentDidMount() {
    ApiCall.get(`subtypes/${this.props.entity.entityId}`).then(result => {
      const selectedEntitySubtypeObject = {
        label: this.formatDefaultLabel(this.props.entity.entityId),
        entityId: this.props.entity.entityId,
        value: {
          entityId: this.props.entity.entityId,
          id: this.props.entity.entityId
        }
      }
      this.setState({
        selectedEntitySubtype: selectedEntitySubtypeObject,
        entitySubtypes: [
          selectedEntitySubtypeObject,
          ...result.data.map(item => ({ label: item.text, entityId: item.id, value: item}))]
      })
    }, this.handleRequestError)
  }

  formatDefaultLabel = (entityId) => {
    const defaultEntityLabelArray = entityId.split('_');

    for (let i = 0; i < defaultEntityLabelArray.length; i++) {
      defaultEntityLabelArray[i] = defaultEntityLabelArray[i].charAt(0).toUpperCase() + defaultEntityLabelArray[i].slice(1);
    }

    return defaultEntityLabelArray.concat('Entity').join('');
  }

  switchFilterOperator = (item) => {
    this.setState({
      filterOperation: item
    })
  }

  selectEntitySubtype = (item) => {
    const reconstructedObject = { entityId: item.value.id, ...item.value }
    this.setState({
      selectedEntitySubtype: item
    })
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
          <hr className="line" />
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

    this.setState({ appliedFilters: appliedFiltersArr });
  }

  onSearchButtonClick = () => {
    const filtersToApply = this.state.appliedFilters.filter(x => x.value !== null);

    let filterString = FilterBuilder.buildFilter(filtersToApply, this.state.filterOperation.value, this.context.globalFiltersCatalogs);
    let appliedFilterText = filtersToApply.map(item => item.textRepresentation ? item.textRepresentation : false);
    this.setState({ appliedFilterText: appliedFilterText }, () => {
      this.props.onFilterApply(filterString, this.state.selectedEntitySubtype);
    });
  }

  onClearButtonClick = () => {
    this.setState({ appliedFilters: [], key: keyPrefix + Date.now(), appliedFilterText: [] });
    let filterString = FilterBuilder.buildFilter([], null, this.context.globalFiltersCatalogs);
    this.props.onFilterApply(filterString);
  }

  getInitialFilterItems = () => {
    return _.filter(this.props.filterMarkup, item => {
      return item.weight !== -1;
    });
  }

  onAddFieldSelected = (item) => {
    let filterItems = this.state.filterItems;
    filterItems.push({ key: item.key, ...item.value });

    this.setState({ filterItems: filterItems });
  }

  getRemainingFields = () => {
    const result = this.props.filterMarkup.map(item => ({
      key: uuidv4(),
      value: item,
      label: <Translate component="div" content={'main.' + item.name.replace('entity-', '')} fallback={item.name.replace('entity-', '')} />
    })
    );
    return result;
  }

  removeFilterItem = (filterItem) => {
    const newFilteritems = this.state.filterItems.filter(filter => filter.key !== filterItem.key);
    const newAppliedFilters = this.state.appliedFilters.filter(item => item.filterItemKey !== filterItem.key && item.value !== null);

    this.setState(prevState => ({
      ...prevState,
      filterItems: newFilteritems,
      appliedFilters: newAppliedFilters
    }));
  }
}

DefaultFilter.contextTypes = {
  globalFiltersCatalogs: PropTypes.array
};
