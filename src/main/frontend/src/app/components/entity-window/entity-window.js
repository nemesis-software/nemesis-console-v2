import React, {Component} from 'react';
import {entitySearchType, entityItemType, entityCreateType} from '../../types/entity-types';
import { componentRequire } from '../../utils/require-util';

let EntitiesViewer = componentRequire('app/components/entity-window/entities-viewer/entities-viewer', 'entities-viewer');
let EntitySections = componentRequire('app/components/entity-window/entity-sections/entity-sections', 'entity-sections');

export default class EntitiesWindow extends Component {
  constructor(props) {
    super(props);
    this.entitiesViewerInstance = null;
  }

  render() {
    let styles = {
      minHeight: 'calc(100vh - 106px)',
      overflowY: 'auto',
      padding: '0px 5px 5px',
      backgroundColor: 'whitesmoke',
    };

    if (!this.props.entity.isVisible) {
      styles.display = 'none';
    }

    return (
      <div style={styles}>
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
