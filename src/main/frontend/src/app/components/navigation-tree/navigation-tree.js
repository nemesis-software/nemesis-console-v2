import React, { Component } from 'react';
import { componentRequire } from '../../utils/require-util';
import ApiCall from '../../services/api-call'

let TreeItem = componentRequire('app/components/navigation-tree/navigation-tree-item', 'navigation-tree-item1');
let NavigationFilter = componentRequire('app/components/navigation-tree/navigation-filter', 'navigation-filter');


export default class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {treeData: [], filteredData: []};
  }

  componentWillMount() {
    ApiCall.get('backend/navigation').then(result => {
      this.setState({treeData: result.data, filteredData: result.data});
    });
  }

  render() {
    return (
      <div>
        <NavigationFilter onFilterChange={this.onFilterChange.bind(this)} data={this.state.treeData} />
        {this.state.filteredData.map((item, index) => <TreeItem  initiallyOpen={this.state.filteredData.length !== this.state.treeData.length} key={index} item={item} nestingLevel={0} nestedItems={item.children || []}><TreeItem/></TreeItem>)}
      </div>
    )
  };

  onFilterChange(filteredTreeItems) {
    this.setState({...this.state, filteredData: filteredTreeItems});
  }
}