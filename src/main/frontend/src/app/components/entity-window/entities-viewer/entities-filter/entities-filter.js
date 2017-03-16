import React, { Component } from 'react';
import { componentRequire } from '../../../../utils/require-util';
import DefaultFilter from './default-filter/default-filter';
import Paper from 'material-ui/Paper';

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
