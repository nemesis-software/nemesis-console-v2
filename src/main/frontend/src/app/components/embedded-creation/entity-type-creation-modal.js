import React, {Component} from 'react';

import {Modal} from 'react-bootstrap';

import ApiCall from 'servicesDir/api-call';

export default class EntityTypeCreationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {creationEntity: null};
    this.selectedCreatingItem = this.props.entityId;
  }

  componentDidMount() {
    ApiCall.get(`subtypes/${this.props.entityId}`).then(result => {
      this.setState({creationEntity: {id: this.props.entityId, text: this.props.entityId, childNodes: result.data}});
    })
  }

  render() {
    return (
      <Modal show={this.props.openModalCreation} onHide={this.handleModalClose.bind(this)} animation={false}>
        <Modal.Header>
          <Modal.Title>Create Entity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.creationEntity ?
            <React.Fragment>
              <div>Please select entity type</div>
              {this.getEntityCategories(this.state.creationEntity, 0).map((item, index) => {
                return (
                  <div style={this.getRadioButtonStyle(item)} key={index}>
                    <label className="radio-inline" style={{marginBottom: '10px'}}>
                      <input className="nemesis-radio-button default-checked" type="radio" value={item.entityId} defaultChecked={index === 0}
                             onChange={this.handleRadioChange.bind(this)} name={'new-entity'}/>
                      {item.text}
                    </label>
                  </div>
                )
              })}
            </React.Fragment> : <div>Loading</div>}
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={this.handleModalClose.bind(this)}>Cancel</button>
          <button className="nemesis-button success-button" onClick={this.handleSelectCreateEntity.bind(this)}>Create</button>
        </Modal.Footer>
      </Modal>
    )
  }

  handleSelectCreateEntity() {
    this.props.onEntityTypeSelected(this.selectedCreatingItem);
  }

  handleModalClose() {
    this.props.onModalCancel();
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