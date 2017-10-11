import React, {Component} from 'react';

import ApiCall from '../../services/api-call';

import _ from 'lodash';

const pagerData = {
  page: 0,
  pageSize: 20
};

export default class RoleViewEntityWindow extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.getEntityPromise = null;
    this.state = {searchData: [], page: {}, sortData: [], filter: null, isDataLoading: false, isEntitySelected: false};
  }


  componentWillMount() {
    this.getEntitiesData(this.props.entityId, pagerData.page, pagerData.pageSize, this.state.filter, this.state.sortData);
  }

  render() {
    return (
      <div>
        {this.state.isEntitySelected ?
          <div>is entity selected</div>
          :
          <div>
            <div className="display-table">

            </div>
          </div>
        }
      </div>
    )
  }

  getEntitiesData(entityId, page, pageSize, filter, sortData) {
    this.setState({...this.state, isDataLoading: true});

    if (this.getEntityPromise) {
      this.getEntityPromise.then(() => {
        this.setState({...this.state, isDataLoading: true});
        this.getEntityPromise = this.getEntityDataPromise(entityId, page, pageSize, filter, sortData);
        return this.getEntityPromise;
      })
    } else {
      this.getEntityPromise = this.getEntityDataPromise(entityId, page, pageSize, filter, sortData);
    }
  }

  getEntityDataPromise(entityId, page, pageSize, filter, sortData) {
    return ApiCall.get(entityId, {page: page, size: pageSize, $filter: filter, sort: this.buildSortArray(sortData), projection: 'search'}).then(result => {
      this.setState({...this.state, searchData: this.mapCollectionData(result.data), page: result.data.page, isDataLoading: false});
    });
  }

  buildSortArray(sortData) {
    sortData = sortData || [];
    let result = [];
    _.forEach(sortData, sortElement => {
      result.push(`${sortElement.field},${sortElement.orderType}`);
    });
    return result;
  }


  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }
}