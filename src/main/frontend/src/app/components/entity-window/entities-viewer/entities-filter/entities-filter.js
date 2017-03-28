import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

import { componentRequire } from '../../../../utils/require-util';

let DefaultFilter = componentRequire('app/components/entity-window/entities-viewer/entities-filter/default-filter/default-filter', 'default-filter');

export default class EntitiesFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {filterMarkup: this.props.filterMarkup};
  }

  render() {
    return (
      <Paper zDepth={1} style={{margin: '5px', padding: '5px'}}>
        <DefaultFilter onFilterApply={this.props.onFilterApply} filterMarkup={this.state.filterMarkup}/>
      </Paper>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({filterMarkup: nextProps.filterMarkup})
  }
}
