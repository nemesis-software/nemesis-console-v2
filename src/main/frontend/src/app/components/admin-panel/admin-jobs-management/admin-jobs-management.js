import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import AdminJobManagement from './admin-job-management';

export default class AdminJobsManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {jobs: []};
  }

  componentWillMount() {
    return PlatformApiCall.get('job/trigger').then(result => {
      this.setState({jobs: result.data});
    });
  }

  render() {
    return (
      <div className="admin-jobs-management">
        {this.state.jobs.map((item, index) => <AdminJobManagement openNotificationSnackbar={this.props.openNotificationSnackbar} data={item} key={index}/>)}
      </div>
    );
  }
}