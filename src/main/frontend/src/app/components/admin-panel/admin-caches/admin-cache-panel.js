import React, {Component} from 'react';
import PlatformApiCall from 'servicesDir/platform-api-call';
import {Modal} from 'react-bootstrap';
import Switch from 'rc-switch';
import AdminCachePanelItem from './admin-cache-panel-item.js';
import 'rc-switch/assets/index.css';

import _ from 'lodash';

export default class AdminCachePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {openDeleteConfirmation: false, cacheForClear: null};
    this.handleCloseDeleteConfirmation = this.handleCloseDeleteConfirmation.bind(this);
    this.onClearCacheClick = this.onClearCacheClick.bind(this);
    this.handleActiveButtonClick = this.handleActiveButtonClick.bind(this);
    this.handleConfirmationDeleteButtonClick = this.handleConfirmationDeleteButtonClick.bind(this);
  }

  render() {
    return (
      <div className="admin-cache-panel paper-box">
        <div className="admin-cache-panel-header">{this.props.name}</div>
        <div className="display-table" style={{width: '100%'}}>
            {this.getCachesForRendering().map((cache,index) => <AdminCachePanelItem key={index} cache={cache} onClearCacheClick={this.onClearCacheClick}
            handleActiveButtonClick={this.handleActiveButtonClick}/>)
            }
        </div>
        {this.getDeleteConfirmationDialog()}
      </div>
    );
  }

  getCachesForRendering() {
    if (!this.props.filterInput) {
      return this.props.caches;
    }

    return this.props.caches.filter(cache => {
      return cache.name.toLowerCase().indexOf(this.props.filterInput.toLowerCase()) > -1;
    })
  }

  getDeleteConfirmationDialog() {
    return (
      <Modal show={this.state.openDeleteConfirmation} onHide={this.handleCloseDeleteConfirmation.bind(this)}  animation={false}>
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
    PlatformApiCall.delete(`caches/${this.state.cacheForClear}`, {cacheManager: this.props.name}).then(() => {
      this.setState({openDeleteConfirmation: false}, () => {
        this.onClearSuccess();
      });
    }, err => {
      this.onClearFail(err);
      this.setState({openDeleteConfirmation: false});
    })
  }

  handleActiveButtonClick(cacheName) {

    PlatformApiCall.post(`caches/${cacheName}`, null, null, {cacheManager: this.props.name}).then(() => {
      this.props.openNotificationSnackbar('Successfully switched!');
    }, err => {
      this.props.openNotificationSnackbar('Something went wrong!!! Refresh the page!!!', 'error');
    })
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
