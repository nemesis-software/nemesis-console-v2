import React, {Component} from 'react';
import PlatformApiCall from 'servicesDir/platform-api-call';

import _ from 'lodash';
import AdminCachePanel from "./admin-cache-panel";

export default class AdminCaches extends Component {
  constructor(props) {
    super(props);
    this.state = {caches: []};
  }

  componentWillMount() {
    this.getCacheData();
  }

  render() {
    return (
      <div className="admin-caches">
        {this.state.caches.map((item, index) => {
          return <AdminCachePanel openNotificationSnackbar={this.props.openNotificationSnackbar} key={index} name={item.managerName} caches={item.caches}/>
        })}
      </div>
    );
  }

  getCaches(data) {
    let result = [];

    _.forIn(data.cacheManagers, (value, key) => {
      result.push({
        managerName: key, caches: _.map(value.caches, (value, key) => {
          return {name: key, enabled: value.enabled}
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
}