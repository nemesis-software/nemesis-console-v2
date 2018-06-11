import React, {Component} from 'react';

import Modal from 'react-bootstrap/lib/Modal';

import ApiCall from 'servicesDir/api-call';
import DataService from 'servicesDir/data-service';


export default class EntityComparePopup extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let entityName = this.props.entityName;
    let firstItemUrl = entityName + '/' + this.props.firstItemId;
    let secondItemUrl = entityName + '/' + this.props.secondItemId;
    let relatedEntities = [];
    Promise.all([DataService.getEntityData(firstItemUrl, relatedEntities), DataService.getEntityData(secondItemUrl, relatedEntities)]).then(result => {
      this.setState({firstEntityData: result[0], secondEntityData: result[1]});
    })
  }

  render() {
    return (
      <Modal show={this.props.openModal} onHide={this.handleModalClose.bind(this)}>
        <Modal.Header>
          <Modal.Title>
            Entity compare
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    )
  }


  handleModalClose() {
    this.props.onModalClose();
  }
}