import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';

export default class BackendConsolePopup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal size="lg" show={this.props.open} onHide={this.props.onClose} backdrop="static" animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.itemId ? 'Edit' : 'Create'}</Modal.Title>
          </Modal.Header>
        <Modal.Body>
          <iframe style={{width: '100%', height: '600px'}} src={this.buildIFrameUrl()}></iframe>
        </Modal.Body>
      </Modal>
    );
  }

  buildIFrameUrl() {
    const contextPath = document.getElementById('contextPath').innerText;
    let baseUrl = `${contextPath}/admin/`;
    if (this.props.itemId) {
        return `${baseUrl}#type=SINGLE_ITEM&itemId=${this.props.itemId}&entityId=${this.props.entityId}&entityName=${this.props.entityName}&iframePreview=true`;
    } else {
        return `${baseUrl}#type=CREATE_ITEM&entityId=${this.props.entityId}&entityName=${this.props.entityName}&iframePreview=true`;
    }
  }
}
