import React, { Component } from 'react';
import { componentRequire } from '../utils/require-util'

var TestItem = componentRequire('app/components/data-renderer', 'data-renderer');

export default class App extends Component {
  render() {
    return (
      <div className="parent">
        <TestItem />
      </div>
    );
  }
}
