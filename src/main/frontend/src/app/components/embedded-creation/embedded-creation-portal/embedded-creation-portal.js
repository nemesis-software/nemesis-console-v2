import React, {Component} from 'react';

import ReactDOM from 'react-dom';

import Modal from 'react-bootstrap/lib/Modal';

import ApiCall from 'servicesDir/api-call';

import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';

import EmbeddedCreationPortalQuickView from "./embedded-creation-portal-quick-view";
import EmbeddedCreationPortalSectionsView from "./embedded-creation-portal-sections-view";

export default class EmbeddedCreationPortal extends Component {
  constructor(props) {
    super(props);
    this.portalsContainer = document.querySelector('.portals-container');
    this.state = {isLoading: false, openErrorDialog: false, errorMessage: null};
    this.viewRef = null;
  }

  componentDidMount() {
    let body = document.querySelector('body');
    if (!body.classList.contains('overflow-portal')) {
      body.classList.add('overflow-portal');
    }
  }

  componentWillUnmount() {
    if (document.querySelectorAll('.embedded-creation-portal').length === 1) {
      let body = document.querySelector('body');
      body.classList.remove('overflow-portal');
    }
  }

  UNSAFE_componentWillUpdate() {
  }

  render() {
    return ReactDOM.createPortal(
      (
        <div className="embedded-creation-portal">
          {this.state.isLoading ? <div className="loading-screen">
            <i className="material-icons loading-icon">cached</i>
          </div> : false}
          {this.props.type === nemesisFieldUsageTypes.quickView ? <EmbeddedCreationPortalQuickView ref={(view) => {this.viewRef = view}} {...this.props}/> :
            <EmbeddedCreationPortalSectionsView ref={(view) => {this.viewRef = view}} {...this.props}/>}
          <div className="portal-action-buttons-container">
            <button className="nemesis-button success-button" style={{marginRight: '15px'}} onClick={this.handleSaveButtonClick.bind(this)}>Save</button>
            <button className="nemesis-button decline-button" onClick={() => this.props.onCreationCancel()}>Cancel</button>
          </div>
          {this.getErrorDialog()}
        </div>

      ),
      this.portalsContainer
    );
  }

  getErrorDialog() {
    return (
      <Modal show={this.state.openErrorDialog} onHide={this.handleCloseErrorDialog.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{color: 'red'}}>{this.state.errorMessage}</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button success-button" onClick={this.handleCloseErrorDialog.bind(this)}>Ok</button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleSaveButtonClick() {
    if (!this.viewRef.isFieldsValid()) {
      return;
    }

    this.setState({...this.state, isLoading: true});

    let dirtyEntityProps = this.viewRef.getDirtyValues();
    let resultObject = {};
    let mediaFields = [];
    dirtyEntityProps.forEach(prop => {
      if (prop.isMedia) {
        mediaFields.push(prop);
      } else {
        resultObject[prop.name] = prop.value;
      }
    });
    ApiCall['post'](this.props.entityId, resultObject).then((result) => {
      this.uploadMediaFile(result.data.id, mediaFields).then(() => {
        this.setState({isLoading: false}, () => {
          this.props.onCreateEntity(result.data);
        });
      });
    }, this.handleRequestError.bind(this));
  }

  uploadMediaFile(itemId, mediaFields) {
    if (!mediaFields || mediaFields.length === 0) {
      return Promise.resolve();
    }
    let data = new FormData();
    data.append('file', mediaFields[0].value);
    return ApiCall.post('upload/media/' + itemId, data, 'multipart/form-data').then(
      () => {
        return Promise.resolve();
      },
      (err) => {
        this.handleRequestError(err);
        return Promise.resolve();
      });
  }

  handleRequestError(err) {
    let errorMsg = (err && err.response && err.response.data && err.response.data.message) || err.message || err;
    this.setState({...this.state, errorMessage: errorMsg, openErrorDialog: true, isLoading: false})
  }

  handleCloseErrorDialog() {
    this.setState({...this.state, openErrorDialog: false});
  }
}
