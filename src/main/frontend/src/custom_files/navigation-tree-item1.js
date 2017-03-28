import React from 'react';
import NavigationTreeItem from '../app/components/navigation-tree/navigation-tree-item';

export default class CustomTreeItem extends NavigationTreeItem {
  constructor(props) {
    super(props);
  }

  getClosedItemIcon() {
    return 'folder';
  }
}
