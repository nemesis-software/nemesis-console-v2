import React, { Component } from 'react';
import { componentRequire } from '../../../utils/require-util';
import DefaultFilter from '../entities-filter/default-filter/default-filter'

export default class EntitiesFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {filterMarkup: this.props.filterMarkup};
  }

  render() {
    return (
      <div>
        <DefaultFilter onFilterApply={this.props.onFilterApply} filterMarkup={this.state.filterMarkup}/>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({filterMarkup: nextProps.filterMarkup})
  }
}

//nemesisEntityField markup name and entity id
