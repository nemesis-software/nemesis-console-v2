import React, { Component } from 'react';

export default class ItemRenderer extends Component {
  someLogger() {
    console.log('here1');
  }

  render() {
    this.someLogger();
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