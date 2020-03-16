import React from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import AdminExpandable from '../admin-expandable';
import _ from 'lodash';

export default class AdminHealth extends AdminExpandable {
  constructor(props) {
    super(props);
    this.state = {data: [], isExpanded: true};
  }

  componentDidMount() {
    PlatformApiCall.get('health').then(result => {
      this.setState({...this.state, data: this.parseHealthData(result.data)})
    });
  }

  getExpandedContent() {
    return (
      <div className="admin-health">
        {this.state.data.map((item, index) => <div className="admin-health-item" key={index}>
          <div className="admin-health-item-header">{item.name} <div className={'health-status-dot blink' + (item.status === 'UP' ? ' online' : ' offline')}>&nbsp;</div></div>
          <div style={{width: '100%'}} className="display-table">
            {this.renderItemProperties(item.properties)}
          </div>
          </div>)}
      </div>
    );
  }

  parseHealthData(data) {
    let result = [];
    _.forIn(data, (value, key) => {
      if (key === 'status' && typeof value === 'string') {
        result.push({name: 'platform', status: value})
      } else {
        _.forIn(value, (detail, key) => {
          let actualValue = {...detail.details};
          delete actualValue.status;
          result.push({name: key, status: detail.status, properties: actualValue})
        })
      }
    });

    return result;
  }

  getHeaderText() {
    return 'Health';
  }

  renderItemProperties(properties) {
    let result = [];
    _.forIn(properties, (value, key) => {
      result.push(
        <div key={key} className="display-table-row">
          <div className="display-table-cell">{key}</div>
          <div className="display-table-cell">{value}</div>
        </div>
      )
    });

    return result;
  }
}