import React, { Component } from 'react';
import { componentRequire } from '../utils/require-util'

var NavigationTree = componentRequire('app/components/navigation-tree', 'navigation-tree');

export default class App extends Component {
  render() {
    return (
      <div>
        Hello from new console!!!
        <NavigationTree />
      </div>
    );
  }
}
