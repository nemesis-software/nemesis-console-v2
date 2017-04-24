import React from 'react';
import MainView from '../app/components/main-view/main-view';

export default class CustomMainView extends MainView {
  constructor(props) {
    super(props);
  }

  openNewEntity(entity) {
    if (entity.entityId === 'Nemesis') {
      let selectedEntity = {
        type: 'iframe',
        url: 'http://nemesis.io',
        entityCode: entity.entityId,
        entityId: 'iframe',
        itemId: null
      };
      this.setSelectedItemInState(selectedEntity);
      return;
    }
    super.openNewEntity(entity);
  }
}
