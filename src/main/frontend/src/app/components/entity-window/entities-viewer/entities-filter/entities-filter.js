import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
        <div style={this.getFilterSelectStyle()}>
          <SelectField
            floatingLabelText="Filter"
            value={this.state.selectedMenuIndex}
            onChange={this.handleFilterChange.bind(this)}
          >
            {this.getFilters().map((item, index) => {
              return  <MenuItem key={index} value={index} primaryText={item.filterName} />
            })}
          </SelectField>
        </div>
        <Paper zDepth={1} style={{margin: '5px', padding: '5px'}}>
          {this.getFilters().map(this.getFilterElement.bind(this))}
        </Paper>
      </div>
    )
  }

  handleFilterChange(event, index) {
    this.setState({...this.state, selectedMenuIndex: index});
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
