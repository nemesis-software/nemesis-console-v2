import React, {Component} from 'react';
import PlatformApiCall from 'servicesDir/platform-api-call';
import Modal from 'react-bootstrap/lib/Modal';

import _ from 'lodash';

export default class AdminCaches extends Component {
  constructor(props) {
    super(props);
    this.state = {caches: []};
  }

  componentWillMount() {
    PlatformApiCall.get('caches').then(result => {
      this.setState({caches: this.findCaches(result.data) || [], openDeleteConfirmation: false, cacheForClear: null});
    });
  }

  render() {
    return (
      <div className="admin-caches">
        <div className="display-table" style={{width: '100%'}}>
          {this.state.caches.map(cache => {
            return <div className="display-table-row" key={cache}>
              <div className="display-table-cell">{cache}</div>
              <div className="display-table-cell" style={{textAlign: 'right'}}>
                <button className="nemesis-button danger-button" onClick={() => this.onClearCacheClick(cache)}>Clear cache</button>
              </div>
            </div>
          })}
        </div>
        {this.getDeleteConfirmationDialog()}
      </div>
    );
  }

  getDeleteConfirmationDialog() {
    return (
      <Modal show={this.state.openDeleteConfirmation} onHide={this.handleCloseDeleteConfirmation.bind(this)}>
        <Modal.Header>
          <Modal.Title>Cache clear</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to clear it?</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={this.handleCloseDeleteConfirmation.bind(this)}>No</button>
          <button className="nemesis-button success-button" onClick={this.handleConfirmationDeleteButtonClick.bind(this)}>Yes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleCloseDeleteConfirmation() {
    this.setState({openDeleteConfirmation: false})
  }

  handleConfirmationDeleteButtonClick() {
    PlatformApiCall.delete(`caches/${this.state.cacheForClear}`).then(() => {
      let caches = this.state.caches;
      let indexOfClearedCache = caches.indexOf(this.state.cacheForClear);
      if (indexOfClearedCache > -1) {
        caches.splice(indexOfClearedCache, 1);

      }
      this.setState({caches: caches, openDeleteConfirmation: false});
      this.onClearSuccess();
    }, this.onClearFail.bind(this))
  }

  onClearCacheClick(cacheName) {
    this.setState({openDeleteConfirmation: true, cacheForClear: cacheName});
  }

  findCaches(data) {
    if (data.cacheNames) {
      return data.cacheNames;
    }

    let cachesName = null;
    _.forIn(data, (value, key) => {
      if (!cachesName) {
        cachesName = this.findCaches(value);
      }
    });

    return cachesName;
  }

  onClearSuccess() {
    this.props.openNotificationSnackbar('Cache cleared');
  }

  onClearFail(err) {
    this.props.openNotificationSnackbar('Execution failed!', 'error');
  }
}