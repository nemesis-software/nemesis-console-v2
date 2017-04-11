import React from 'react';
import EntitySections from '../app/components/entity-window/entity-sections/entity-sections';

export default class CustomEntitySections extends EntitySections {
  constructor(props) {
    super(props);
  }

  getFunctionalButtons(entity) {
    //get base array of buttons
    let buttons = super.getFunctionalButtons(entity);

    // if entity name is "category" add custom button
    if (entity.entityName === 'category') {
      buttons.push({label: 'Open google', onClickFunction: () => this.handleOpenGoogleButton()})
    }

    return buttons;
  }

  //custom function for new button
  handleOpenGoogleButton() {
    window.open('http://google.com');
  }
}
