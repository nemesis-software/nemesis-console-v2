import React, { Component } from 'react';
import { componentRequire } from '../utils/require-util'

var ItemRenderer = componentRequire('app/components/item-renderer', 'item-renderer1');

export default class DataRenderer extends Component {
  constructor(props) {
    super(props);

    this.state = {searchValue: '', data: []};
  }

  componentDidMount() {
    this.setState({...this.state, data: this.getData()})
  }

  getData() {
    return [
      {name: '111'},
      {name: 'bbb'}
    ]
  }

  searchData() {
    this.props.searchData(this.state.searchValue);
  }

  render() {
    return (
      <div className="parent">
        <input type="text" value={this.state.searchValue} onChange={event => this.setState({searchValue: event.target.value})}/>
        <button onClick={this.searchData.bind(this)}>Search</button>
        <div>Searched data</div>
        <ItemRenderer data={this.props.searchedResult}/>
        <hr/>
        <div>All Data</div>
        <ItemRenderer data={this.state.data}/>
      </div>
    );
  }
}
