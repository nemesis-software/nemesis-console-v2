import React from 'react';
import AdminExpandable from '../admin-expandable';
import _ from 'lodash';
import PlatformApiCall from '../../../services/platform-api-call';


export default class AdminJobManagement extends AdminExpandable {
  constructor(props) {
    super(props);
    this.state = {isExpanded: false, executionId: null};
  }

  getExpandedContent() {
    if (_.isEmpty(this.props.data)) {
      return <div></div>
    }

    return (
      <div style={{width: '100%'}} className="display-table admin-job-management">
        Interval: {this.props.data.interval} <br />
        Initial delay: {this.props.data.initialDelay} <br />
        Job name: {this.props.data.jobName} <br />
        Expression: {this.props.data.expression} <br />
        Trigger: {this.props.data.trigger} <br />
        <div className="job-actions">
          <button className="btn btn-default" onClick={this.onRunButtonClick.bind(this)}>Run <i className="fa fa-play"/></button>
          <button className="btn btn-default" onClick={this.onStopButtonClick.bind(this)}>Stop <i className="fa fa-stop"/></button>
          <button className="btn btn-default" onClick={this.onRestartButtonClick.bind(this)}>Restart <i className="fa fa-refresh"/></button>
          <button className="btn btn-default" onClick={this.onScheduleButtonClick.bind(this)}>Schedule <i className="fa fa-calendar-plus-o"/></button>
          <button className="btn btn-default" onClick={this.onUnscheduleButtonClick.bind(this)}>Unschedule <i className="fa fa-calendar-times-o"/></button>
        </div>
      </div>
    );
  }

  getHeaderText() {
    return (
      <div className="display-table">
        <div className="display-table-cell" style={{width: '100%'}}>{this.props.data.name}</div>
        <div className="display-table-cell job-management-type">{this.props.data.type}</div>
      </div>
    );
  }

  onRunButtonClick() {
    PlatformApiCall.post(`job/run/${this.props.data.name}`).then(result => {
      this.props.openNotificationSnackbar('Job successfully run!');
      this.setState({...this.state, executionId: result.data});
    }, this.onError.bind(this))
  }

  onStopButtonClick() {
    if (!this.state.executionId) {
      return;
    }

    PlatformApiCall.post(`job/execution/stop/${this.state.executionId}`).then(result => {
      this.props.openNotificationSnackbar('Job successfully stop!');
    }, this.onError.bind(this))
  }

  onRestartButtonClick() {
    if (!this.state.executionId) {
      return;
    }

    PlatformApiCall.post(`job/execution/restart/${this.state.executionId}`).then(result => {
      this.props.openNotificationSnackbar('Job successfully restarted!');
    }, this.onError.bind(this))
  }

  onScheduleButtonClick() {
    PlatformApiCall.post(`job/schedule/${this.props.data.name}`).then(result => {
      this.props.openNotificationSnackbar(result.data);
    }, this.onError.bind(this))
  }

  onUnscheduleButtonClick() {
    PlatformApiCall.post(`job/unschedule/${this.props.data.name}`).then(result => {
      this.props.openNotificationSnackbar(result.data);
    }, this.onError.bind(this))
  }

  onError(err) {
    console.log(err);
    this.props.openNotificationSnackbar('Something went wrong!', 'error');
  }
}