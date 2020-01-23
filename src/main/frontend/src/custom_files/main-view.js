import React from 'react';
import MainView from '../app/components/main-view/main-view';

import PropTypes from 'prop-types';

export default class CustomMainView extends MainView {
  constructor(props, context) {
    super(props, context);
  }

  UNSAFE_componentWillMount() {
    let selectedEntity = {
      type: 'dashboard',
      entityCode: 'AdminDashboard',
      entityId: 'dashboard',
      itemId: null
    };
    super.UNSAFE_componentWillMount().then(null, () => {
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


CustomMainView.contextTypes = {
  markupData: PropTypes.object,
  entityMarkupData: PropTypes.object
};
