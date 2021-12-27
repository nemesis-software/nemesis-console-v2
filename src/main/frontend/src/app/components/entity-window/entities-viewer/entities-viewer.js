import React, { Component } from 'react';

import _ from 'lodash';

import ApiCall from '../../../services/api-call';
import DataHelper from 'servicesDir/data-helper';

import { componentRequire } from '../../../utils/require-util';

import { Modal } from 'react-bootstrap';
import FilterBuilder from "../../../services/filter-builder";
import PropTypes from "prop-types";

let EntitiesResultViewer = componentRequire('app/components/entity-window/entities-viewer/entities-result-viewer/entities-result-viewer', 'entities-result-viewer');
let EntitiesFilter = componentRequire('app/components/entity-window/entities-viewer/entities-filter/entities-filter', 'entities-filter');

const pagerData = {
  page: 0,
  pageSize: 20
};

export default class EntitiesViewer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      searchData: [],
      page: {},
      sortData: [],
      filter: FilterBuilder.buildFilter([], null, context.globalFiltersCatalogs),
      isDataLoading: false,
      openErrorDialog: false,
      errorMessage: null
    };
    this.getEntityPromise = null;
    this.child = React.createRef();
  }

  componentDidMount() {
    this.getEntitiesData(this.props.entity, pagerData.page, pagerData.pageSize, this.state.filter, this.state.sortData, false);
  };

  render() {
    return (
      <div className={'entities-viewer' + (this.state.isDataLoading ? ' on-loading' : '')}>
        {this.state.isDataLoading ? <div className="loading-screen">
          <i className="material-icons loading-icon">cached</i>
        </div> : false}
        <EntitiesFilter entity={this.props.entity}
          filterMarkup={this.props.entity.data ? this.props.entity.data.filter: []}
          onFilterApply={this.onFilterApply}
          retakeEntityData={this.getEntitiesDataFromDefaultFilter} />

        <EntitiesResultViewer
          ref={this.child}
          entities={this.state.searchData}
          entity={this.props.entity}
          localesMarkup={this.props.localesMarkup}
          entitiesMarkup={this.props.entity && this.props.entity.data ? this.props.entity.data.result : []}
          onPagerChange={this.onPagerChange}
          onSortDataChange={this.onSortDataChange}
          page={this.state.page}
          sortData={this.state.sortData}
          restUrl={this.state.restUrl}
          onEntityItemClick={this.onEntityItemClick} />
        {this.getErrorDialog()}
      </div>
    )
  }

  onFilterApply = (filter, entity = this.props.entity) => {
    this.setState({ ...this.state, filter: filter }, () => {
      this.getEntitiesData(entity, pagerData.page, this.state.page.size, filter, this.state.sortData, true);
    });
  }

  getEntitiesData(entity, page, pageSize, filter, sortData, scrollToResult) {
    this.setState({ ...this.state, isDataLoading: true });

    if (this.getEntityPromise) {
      this.getEntityPromise.then(() => {
        this.setState({ ...this.state, isDataLoading: true });
        this.getEntityPromise = this.getEntityDataPromise(entity, page, pageSize, filter, sortData, scrollToResult);
        return this.getEntityPromise;
      })
    } else {
      this.getEntityPromise = this.getEntityDataPromise(entity, page, pageSize, filter, sortData, scrollToResult);
    }
  };

  scrollOnSearch = (condition) => {
    if (condition) {
      this.child.current.scrollToMyRef();
    };
  };

  getEntitiesDataFromDefaultFilter = (item) => {
    this.setState({
      filter: FilterBuilder.buildFilter([], null, this.context.globalFiltersCatalogs),
      sortData: []
    }, () => this.getEntitiesData(item, pagerData.page, pagerData.pageSize, this.state.filter, this.state.sortData))
  }

  getEntityDataPromise(entity, page, pageSize, filter, sortData, scrollToResult) {

    return ApiCall.get(entity.entityId, { page: page, size: pageSize, $filter: filter, sort: this.buildSortArray(sortData), projection: 'search' }).then(result => {

      this.setState({ ...this.state, searchData: DataHelper.mapCollectionData(result.data), page: result.data.page, isDataLoading: false, restUrl: result.request.responseURL }
        , () => this.scrollOnSearch(scrollToResult));
    }, this.handleRequestError);
  }

  onEntityItemClick = (item, entityId, url, itemType, additionParams) => {
    if (!itemType) {
      this.props.onEntityItemClick(item, this.props.entity.entityId, item._links.self.href);
    } else {
      this.props.onEntityItemClick(item, entityId, url, itemType, additionParams)
    }
  }

  retakeEntityData = () => {
    this.getEntitiesData(this.props.entity, this.state.page.number, this.state.page.size, this.state.filter, this.state.sortData);
  }

  onPagerChange = (page, pageSize) => {
    this.getEntitiesData(this.props.entity, page, pageSize, this.state.filter, this.state.sortData);
  }

  onSortDataChange = (sortData) => {
    this.setState({ ...this.state, sortData: sortData }, () => {
      this.getEntitiesData(this.props.entity, pagerData.page, this.state.page.size, this.state.filter, sortData);
    });
  }

  handleRequestError = (err) => {
    let errorMsg = (err && err.response && err.response.data && err.response.data.message) || err.message || err;
    this.setState({ ...this.state, errorMessage: errorMsg, openErrorDialog: true, isDataLoading: false })
  }

  getErrorDialog() {
    return (
      <Modal show={this.state.openErrorDialog} onHide={this.handleCloseErrorDialog} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ color: 'red' }}>{this.state.errorMessage}</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button success-button" onClick={this.handleCloseErrorDialog}>Ok</button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleCloseErrorDialog = () => {
    this.setState({ ...this.state, openErrorDialog: false });
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

EntitiesViewer.contextTypes = {
  globalFiltersCatalogs: PropTypes.array
};
