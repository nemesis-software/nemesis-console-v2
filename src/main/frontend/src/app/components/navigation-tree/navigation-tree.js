import React, { Component } from 'react';
import { componentRequire } from '../../utils/require-util';
import ApiCall from '../../services/api-call';
import _ from 'lodash';

let TreeItem = componentRequire('app/components/navigation-tree/navigation-tree-item', 'navigation-tree-item');
let NavigationFilter = componentRequire('app/components/navigation-tree/navigation-filter', 'navigation-filter');

export default class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {treeData: [], filteredData: []};
    this.selectedCreatingItem = null;
  }

  componentWillMount() {
    this.populateNavigationData();
  }

  render() {
    return (
      <div>
        <NavigationFilter onFilterChange={this.onFilterChange.bind(this)} data={this.state.treeData} />
        {this.state.filteredData.map((item, index) => <TreeItem onEntityClick={this.props.onEntityClick}
                                                                initiallyOpen={this.state.filteredData.length !== this.state.treeData.length}
                                                                key={index}
                                                                item={item}
                                                                nestingLevel={0}
                                                                nestedItems={item.children || []}>
          <TreeItem/>
        </TreeItem>)}
      </div>
    )
  };

  onFilterChange(filteredTreeItems) {
    this.setState({...this.state, filteredData: filteredTreeItems});
  }

  shouldComponentUpdate(nextProps, nextState) {
   if (_.isEqual(this.state, nextState)) {
     return false;
   }

   return true;
  }

  getNavigationData() {
    return ApiCall.get('backend/navigation');
  }

  populateNavigationData() {
    this.getNavigationData().then(result => {
      this.setState({...this.state, treeData: result.data, filteredData: result.data});
    });
  }
}