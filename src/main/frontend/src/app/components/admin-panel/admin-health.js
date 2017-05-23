import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';
import _ from 'lodash';

export default class AdminHealth extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentWillMount() {
    PlatformApiCall.get('health').then(result => {
      console.log(result.data);
      this.setState({data: this.parseHealthData(result.data)})
    });
  }

  render() {
    return (
      <div className="admin-health paper-box">
        {this.state.data.map((item, index) => <div className="admin-health-item" key={index}>
          {item.name} <div className={'health-status-dot blink' + (item.status === 'UP' ? ' online' : ' offline')}>&nbsp;</div>
          <hr className="line" />
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
        result.push({name: key, status: value.status})
      }
    });

    return result;
  }
}