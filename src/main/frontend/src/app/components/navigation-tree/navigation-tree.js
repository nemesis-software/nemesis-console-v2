import React, { Component } from 'react';
import { componentRequire } from '../../utils/require-util';
import CONFIG from '../../../CONFIG'
import axios from 'axios';

let TreeItem = componentRequire('app/components/navigation-tree/navigation-tree-item', 'navigation-tree');
let NavigationFilter = componentRequire('app/components/navigation-tree/navigation-filter', 'navigation-filter');


export default class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {treeData: [], filteredData: []};
  }

  componentWillMount() {
    let url = CONFIG.baseUrl + 'backend/navigation';
    let nemesisToken = document.getElementById('token').getAttribute('value');
    axios.get(url, {
      headers: {'X-Nemesis-Token': nemesisToken}
    }).then(result => {
      this.setState({treeData: result.data, filteredData: result.data});
    })
  }

  render() {
    return (
      <div>
        <NavigationFilter onFilterChange={this.onFilterChange.bind(this)} data={this.state.treeData} />
        {this.state.filteredData.map((item, index) => <TreeItem initiallyOpen={this.state.filteredData.length !== this.state.treeData.length} key={index} item={item} nestingLevel={0} children={item.children || []} />)}
      </div>
    )
  };

  onFilterChange(filteredTreeItems) {
    this.setState({...this.state, filteredData: filteredTreeItems});
  }
}