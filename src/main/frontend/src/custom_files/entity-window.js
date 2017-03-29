import React from 'react';
import EntityWindow from '../app/components/entity-window/entity-window';

export default class CustomEntityWindow extends EntityWindow {
  constructor(props) {
    super(props);
  }

  renderEntityByType(entity) {

    switch (entity.type) {
      case 'iframe': {
        //TODO: make a custom react component and prevent window update to can keep state on the iframe
        return <iframe style={{width: '98%', height: '98%'}} src={entity.url}></iframe>
      }
      default: {
        return super.renderEntityByType(entity);
      }
    }
  }
}
