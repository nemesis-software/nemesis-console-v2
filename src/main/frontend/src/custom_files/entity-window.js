import React from 'react';
import EntityWindow from '../app/components/entity-window/entity-window';
import AdminDashboard from '../custom_files/custom-windows/admin-dashboard'

export default class CustomEntityWindow extends EntityWindow {
  constructor(props) {
    super(props);
  }

  renderEntityByType(entity) {
    switch (entity.type) {
      case 'dashboard': {
        return <AdminDashboard/>
      }
      default: {
        return super.renderEntityByType(entity);
      }
    }
  }
}
