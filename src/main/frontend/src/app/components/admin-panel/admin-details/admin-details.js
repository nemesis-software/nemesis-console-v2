import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import AdminInfo from './admin-info';
import AdminHealth from './admin-health';
import AdminJVM from './admin-jvm';
import AdminGC from './admin-gc';
import AdminMemory from './admin-memory';
import AdminServletContainer from './admin-servlet-container';

export default class AdminDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }

  componentWillMount() {
    PlatformApiCall.get('metrics').then(result => {
      this.setState({data: result.data})
    });
  }

  render() {
    return (
      <div className="admin-details">
        <AdminInfo />
        <AdminHealth />
      </div>
    );
  }
  
}
