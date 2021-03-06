import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import AdminThread from './admin-thread';

export default class AdminThreads extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentDidMount() {
    PlatformApiCall.get('threaddump').then(result => {
      this.setState({data: result.data.threads})
    });
  }

  render() {
    return (
      <div className="admin-threads">
        {this.state.data.map((item, index) => <AdminThread thread={item} key={index}/>)}
      </div>
    );
  }
}