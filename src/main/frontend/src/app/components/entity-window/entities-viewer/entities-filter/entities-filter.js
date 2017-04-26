import React, { Component } from 'react';

import Translate from 'react-translate-component';

import { componentRequire } from '../../../../utils/require-util';

let DefaultFilter = componentRequire('app/components/entity-window/entities-viewer/entities-filter/default-filter/default-filter', 'default-filter');

export default class EntitiesFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {filterMarkup: this.props.filterMarkup, selectedMenuIndex: 0};
  }

  render() {
    return (
      <div>
        <div className="paper-box" style={{margin: '5px', padding: '5px'}}>
          <div style={this.getFilterSelectStyle()}>
            <label><Translate content={'main.Filter'} fallback={'Filter'}/></label>
            <select style={{width: '265px'}} className="form-control" onChange={this.handleFilterChange.bind(this)} disabled={this.props.readOnly}>
              {this.getFilters().map((item, index) =><option key={index} value={index}>{item.filterName}</option>)}
            </select>
          </div>
          {this.getFilters().map(this.getFilterElement.bind(this))}
        </div>
      </div>
    )
  }

  handleFilterChange(event) {
    this.setState({...this.state, selectedMenuIndex: event.target.selectedIndex});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({filterMarkup: nextProps.filterMarkup})
  }

  getFilters() {
    return [{filterName: 'Default filter', filterClass: DefaultFilter}];
  }

  getFilterSelectStyle() {
    let style = {};
    if (this.getFilters().length <= 1) {
      style = {display: 'none'};
    }

    return style;
  }

  getFilterElement(filter, index) {
    let config = {
      key: index,
      onFilterApply: this.props.onFilterApply,
      filterMarkup: this.state.filterMarkup,
      style: index === this.state.selectedMenuIndex ? {} : {display: 'none'}
    };

    return React.createElement(filter.filterClass, config);
  }

}
