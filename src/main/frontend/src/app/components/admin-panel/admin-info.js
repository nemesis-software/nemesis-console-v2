import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';
import _ from 'lodash';

export default class AdminInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentWillMount() {
    PlatformApiCall.get('info').then(result => {
      console.log(result.data);
      this.setState({data: result.data})
    });
  }

  render() {
    return (
      <div className="paper-box">
        <div>
          <div>Platform</div>
          {this.getRenderDataObject(this.state.data.platform)}
        </div>
        <div>
          <div>Application</div>
          {this.getRenderDataObject(this.state.data.app)}
        </div>
      </div>
    );
  }

  getRenderDataObject(data) {
    let result = [];
    _.forIn(data, (value, key) => {
      result.push(<div key={key}>{key}: {value}</div>)
    });

    return result;
  }
}