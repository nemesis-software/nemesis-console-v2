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
        id: 'iframe',
        text: 'Custom IFrame',
        children: [{id: 'Nemesis', text:'Nemesis frame', leaf: true}]
      });
      this.setState({...this.state, treeData: data, filteredData: data});
    });
  }
}
