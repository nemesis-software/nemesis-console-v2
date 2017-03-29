import React from 'react';
import MainView from '../app/components/main-view/main-view';

export default class CustomMainView extends MainView {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedEntity.entityId === 'Nemesis') {
      let selectedEntity = {
        type: 'iframe',
        url: 'http://nemesis.io',
        entityCode: nextProps.selectedEntity.entityId,
        entityId: 'iframe',
        itemId: null
      };
      this.setSelectedItemInState(selectedEntity);
      return;
    }
    super.componentWillReceiveProps(nextProps);
  }
}
