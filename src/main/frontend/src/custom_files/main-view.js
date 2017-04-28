import React from 'react';
import MainView from '../app/components/main-view/main-view';

export default class CustomMainView extends MainView {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let selectedEntity = {
      type: 'dashboard',
      entityCode: 'AdminDashboard',
      entityId: 'dashboard',
      itemId: null
    };
    super.componentWillMount().then(null, () => {
      this.setSelectedItemInState(selectedEntity);
    });
  }

  openNewEntity(entity) {
    if (entity.entityId === 'AdminDashboard') {
      let selectedEntity = {
        type: 'dashboard',
        entityCode: entity.entityId,
        entityId: 'dashboard',
        itemId: null
      };
      this.setSelectedItemInState(selectedEntity);
      return;
    }
    super.openNewEntity(entity);
  }
}
