import React, {Component} from 'react';

import Modal from 'react-bootstrap/lib/Modal';

import EntityTypeCreationModal from './entity-type-creation-modal';

export default class EmbeddedCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {openModalCreation: true};
  }

  render() {
    return (
      <React.Fragment>
        {this.state.openModalCreation ? <EntityTypeCreationModal openModalCreation={this.state.openModalCreation} entityId={this.props.entityId}/> : false}
      </React.Fragment>
    )
  }

  handleSelectCreateEntity() {

  }

  handleModalClose() {

  }

  getRadioButtonStyle(item) {
    let marginValue = item.nestingLevel * 15;
    return {
      marginLeft: marginValue + 'px'
    }
  }

  handleRadioChange(e) {
    this.selectedCreatingItem = e.target.value;
  }

  getEntityCategories(entity, nestingLevel) {
    let result = [];
    if (!entity) {
      return result;
    }

    result.push({entityId: entity.id, text: entity.text, nestingLevel: nestingLevel});
    if (entity.childNodes && entity.childNodes.length > 0) {
      entity.childNodes.map(node => {
        result = result.concat(this.getEntityCategories(node, nestingLevel + 1))
      })
    }

    return result;
  }
}