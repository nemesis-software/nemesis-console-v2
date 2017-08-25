import React, {Component} from 'react';
import {entitySearchType, entityItemType, entityCreateType} from '../../types/entity-types';
import { componentRequire } from '../../utils/require-util';

import AdminPanel from '../admin-panel/admin-panel';
let EntitiesViewer = componentRequire('app/components/entity-window/entities-viewer/entities-viewer', 'entities-viewer');
let EntitySections = componentRequire('app/components/entity-window/entity-sections/entity-sections', 'entity-sections');

export default class EntitiesWindow extends Component {
  constructor(props) {
    super(props);
    this.entitiesViewerInstance = null;
  }

  render() {
    let styles = {
    };

    if (!this.props.entity.isVisible) {
      styles.display = 'none';
    }

    return (
      <div className="entities-window" style={styles}>
        {this.renderEntityByType(this.props.entity)}
      </div>
    )
  }

  renderEntityByType(entity) {
    switch (entity.type) {
      case entityCreateType:
      case entityItemType: {
        return <EntitySections entity={entity}
                               onEntityItemClick={this.props.onEntityItemClick}
                               updateNavigationCode={this.props.updateNavigationCode}
                               onEntityWindowClose={this.props.onEntityWindowClose}
                               onUpdateEntitySearchView={this.props.onUpdateEntitySearchView}
                               updateCreatedEntity={this.props.updateCreatedEntity}
                               openNotificationSnackbar={this.props.openNotificationSnackbar}/>
      }
      case entitySearchType: {
        return <EntitiesViewer ref={this.setEntitiesViewerInstance.bind(this)} entity={entity} onEntityItemClick={this.props.onEntityItemClick}/>
      }
      case 'adminPanel': {
        return <AdminPanel openNotificationSnackbar={this.props.openNotificationSnackbar} />
      }
      default: {
        return <div>INVALID ENTITY TYPE!!!</div>
      }
    }
  }

  retakeEntitiesViewerData() {
    if (this.entitiesViewerInstance) {
      this.entitiesViewerInstance.retakeEntityData();
    }
  }

  setEntitiesViewerInstance(item) {
    if (item) {
      this.entitiesViewerInstance = item;
    }
  }
}
