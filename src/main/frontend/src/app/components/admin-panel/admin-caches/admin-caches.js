import React, {Component} from 'react';
import PlatformApiCall from 'servicesDir/platform-api-call';

import _ from 'lodash';
import AdminCachePanel from "./admin-cache-panel";
import counterpart from "counterpart";

export default class AdminCaches extends Component {
  constructor(props) {
    super(props);
    this.state = {caches: []};
  }

  componentDidMount() {
    this.getCacheData();
  }

  render() {
    return (
      <div className="admin-caches">
        <div className="input-group" style={{marginBottom: '10px'}}>
          <input type="text"
                 placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search" /></span>
        </div>
        {this.state.caches.map((item, index) => {
        debugger;
          return <AdminCachePanel filterInput={this.state.filterInput} openNotificationSnackbar={this.props.openNotificationSnackbar} key={index} name={item.managerName} caches={item.caches}/>
        })}
      </div>
    );
  }

  getCaches(data) {
    let result = [];

    _.forIn(data.cacheManagers, (value, key) => {
      result.push({
        managerName: key, caches: _.map(value.caches, (value, key) => {
          return {name: key, enabled: value.enabled, isEmpty: value.empty}
        })
      })
    });

    return result;
  }

  getCacheData() {
    PlatformApiCall.get('caches').then(result => {
      this.setState({caches: this.getCaches(result.data) || []});
    });
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    this.setState({filterInput: searchValue});
  }
}
