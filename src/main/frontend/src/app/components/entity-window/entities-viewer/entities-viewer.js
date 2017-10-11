import React, { Component } from 'react';

import _ from 'lodash';

import ApiCall from '../../../services/api-call';
import { componentRequire } from '../../../utils/require-util';

import Modal from 'react-bootstrap/lib/Modal';

let EntitiesResultViewer = componentRequire('app/components/entity-window/entities-viewer/entities-result-viewer/entities-result-viewer', 'entities-result-viewer');
let EntitiesFilter = componentRequire('app/components/entity-window/entities-viewer/entities-filter/entities-filter', 'entities-filter');

const pagerData = {
  page: 0,
  pageSize: 20
};

export default class EntitiesViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {searchData: [], page: {}, sortData: [], filter: null, isDataLoading: false, openErrorDialog: false, errorMessage: null};
    this.getEntityPromise = null;
  }

  componentWillMount() {
    this.getEntitiesData(this.props.entity, pagerData.page, pagerData.pageSize, this.state.filter, this.state.sortData);
  }

  render() {
    return (
      <div className={'entities-viewer' + (this.state.isDataLoading ? ' on-loading' : '')}>
        {this.state.isDataLoading ? <div className="loading-screen">
          <i className="material-icons loading-icon">cached</i>
        </div> : false}
        <EntitiesFilter entity={this.props.entity} filterMarkup={this.props.entity.data.filter} onFilterApply={this.onFilterApply.bind(this)}/>
        <EntitiesResultViewer entities={this.state.searchData}
                              entity={this.props.entity}
                              entitiesMarkup={this.props.entity.data.result}
                              onPagerChange={this.onPagerChange.bind(this)}
                              onSortDataChange={this.onSortDataChange.bind(this)}
                              page={this.state.page}
                              sortData={this.state.sortData}
                              onEntityItemClick={this.onEntityItemClick.bind(this)}/>
        {this.getErrorDialog()}
      </div>
    )
  }

  onFilterApply(filter) {
    this.setState({...this.state, filter: filter}, () => {
      this.getEntitiesData(this.props.entity, pagerData.page, this.state.page.size, filter, this.state.sortData);
    });
  }

  getEntitiesData(entity, page, pageSize, filter, sortData) {
    this.setState({...this.state, isDataLoading: true});

    if (this.getEntityPromise) {
      this.getEntityPromise.then(() => {
        this.setState({...this.state, isDataLoading: true});
        this.getEntityPromise = this.getEntityDataPromise(entity, page, pageSize, filter, sortData);
        return this.getEntityPromise;
      })
    } else {
      this.getEntityPromise = this.getEntityDataPromise(entity, page, pageSize, filter, sortData);
    }
  }

  getEntityDataPromise(entity, page, pageSize, filter, sortData) {
    return ApiCall.get(entity.entityId, {page: page, size: pageSize, $filter: filter, sort: this.buildSortArray(sortData), projection: 'search'}).then(result => {
      this.setState({...this.state, searchData: this.mapCollectionData(result.data), page: result.data.page, isDataLoading: false});
    }, this.handleRequestError.bind(this));
  }

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  onEntityItemClick(item) {
    this.props.onEntityItemClick(item, this.props.entity.entityId, item._links.self.href);
  }

  retakeEntityData() {
    this.getEntitiesData(this.props.entity, this.state.page.number, this.state.page.size, this.state.filter);
  }

  onPagerChange(page, pageSize) {
    this.getEntitiesData(this.props.entity, page, pageSize, this.state.filter);
  }

  onSortDataChange(sortData) {
    this.setState({...this.state, sortData: sortData}, () => {
      this.getEntitiesData(this.props.entity, pagerData.page, this.state.page.size, this.state.filter, sortData);
    });
  }

  handleRequestError(err) {
    let errorMsg = (err && err.response && err.response.data && err.response.data.message) || err.message || err;
    this.setState({...this.state, errorMessage: errorMsg, openErrorDialog: true, isDataLoading: false})
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

  handleCloseErrorDialog() {
    this.setState({...this.state, openErrorDialog: false});
  }

  buildSortArray(sortData) {
    sortData = sortData || [];
    let result = [];
    _.forEach(sortData, sortElement => {
      result.push(`${sortElement.field},${sortElement.orderType}`);
    });
    return result;
  }
}