import React, { Component } from 'react';
import axios from 'axios';
import CONFIG from '../../CONFIG'

export default class NavigationTree extends Component {
  componentWillMount() {
    var url = CONFIG.baseUrl + 'backend/navigation';
    axios.get(url).then(result => {
      console.log(result.data);
    })
  }

  render() {
    if (!this.props.data) {
      return (
        <div></div>
      )
    }

    return (
      <div className="child">
        {this.props.data.map(item => <div key={item.name}>{item.name}</div>)}
      </div>
    );
  }
}