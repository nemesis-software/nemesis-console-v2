import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import AdminJobManagement from './admin-job-management';
import counterpart from "counterpart";

export default class AdminJobsManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {jobs: [], filteredJobs: [], searchInput: ''};
  }

  componentDidMount() {
    return PlatformApiCall.get('job/trigger').then(result => {
      this.setState({jobs: result.data, filteredJobs: result.data});
    });
  }

  render() {
    return (
      <div className="admin-jobs-management">
        <div className="input-group">
          <input type="text"
                 placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search" /></span>
        </div>
        {this.state.filteredJobs.map((item, index) => <AdminJobManagement openNotificationSnackbar={this.props.openNotificationSnackbar} data={item} key={index}/>)}
      </div>
    );
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let filteredJobs = this.state.jobs;
    if (searchValue) {
      filteredJobs = filteredJobs.filter(item => {
        return item.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
      })
    }
    this.setState({...this.state, searchInput: searchValue, filteredJobs: filteredJobs});
  }
}