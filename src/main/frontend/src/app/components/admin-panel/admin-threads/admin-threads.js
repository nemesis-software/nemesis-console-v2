import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import AdminThread from './admin-thread';

export default class AdminThreads extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentWillMount() {
    PlatformApiCall.get('dump').then(result => {
      console.log(result.data);
      this.setState({data: result.data})
    });
  }

  render() {
    return (
      <div className="container admin-threads">
        Admin Threads
        {this.state.data.map((item, index) => <AdminThread thread={item} key={index}/>)}
      </div>
    );
  }
}