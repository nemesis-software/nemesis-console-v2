import React, { Component } from 'react';
import { componentRequire } from '../../utils/require-util';
import ApiCall from '../../services/api-call';
import _ from 'lodash';

let TreeItem = componentRequire('app/components/navigation-tree/navigation-tree-item', 'navigation-tree-item1');
let NavigationFilter = componentRequire('app/components/navigation-tree/navigation-filter', 'navigation-filter');

const styles = {
  position: 'fixed',
  width: '300px',
  left: '0',
  top: '68px',
  height: 'calc(100vh - 68px)',
  overflowY: 'scroll'
};

export default class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {treeData: [], filteredData: []};
    this.selectedCreatingItem = null;
  }

  componentWillMount() {
    ApiCall.get('backend/navigation').then(result => {
      this.setState({...this.state, treeData: result.data, filteredData: result.data});
    });
  }

  render() {
    return (
      <div style={styles}>
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
}