import React from 'react';
import NavigationTree from '../app/components/navigation-tree/navigation-tree';

export default class CustomTreeItem extends NavigationTree {
  constructor(props) {
    super(props);
  }

  populateNavigationData() {
    this.getNavigationData().then(result => {
      let data = result.data;
      data.unshift({
        id: 'AdminDashboard',
        text: 'Admin',
        children: [{id: 'AdminDashboard', text:'Admin dashboard', leaf: true}]
      });
      this.setState({...this.state, treeData: result.data, filteredData: this.filterChildren(result.data, this.state.filterContent)});
    });
  }
}
