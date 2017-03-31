import React from 'react';

import EntitiesResultViewer from '../app/components/entity-window/entities-viewer/entities-result-viewer/entities-result-viewer';
import CardViewer from './viewers/card-viewer';

export default class CustomViewers extends EntitiesResultViewer {
  constructor(props) {
    super(props);
  }

  getViewers() {
    let viewers = super.getViewers();
    if (this.props.entity.entityId === 'category') {
      viewers.push({viewerName: 'Card Viewer', viewerClass: CardViewer});
    }

    return viewers;
  }
}
