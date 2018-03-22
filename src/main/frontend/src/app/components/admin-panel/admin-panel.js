import React, {Component} from 'react';
import '../../../styles/admin-panel.less';
import AdminImport from './admin-import';
import AdminSpringBeans from './admin-spring-beans';
import AdminIdAnalyzer from './admin-id-analyzer';
import AdminSystemProperties from './admin-system-properties/admin-system-properties';
import AdminThreads from './admin-threads/admin-threads';
import AdminDetails from './admin-details/admin-details';
import AdminLoggers from './admin-loggers/admin-loggers';
import AdminInsertScript from './admin-insert-script';
import AdminJobsManagement from './admin-jobs-management/admin-jobs-management';
import AdminCsvExport from './admin-csv-export/admin-csv-export';
import AdminSessions from './admin-sessions/admin-sessions';
import SwipeableViews from 'react-swipeable-views';
import {componentRequire} from "../../utils/require-util";
import NotificationSystem from 'react-notification-system';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');


export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { sectionIndex: 0};
    this.notificationSystem = null;
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  render() {
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
        <div className="nemesis-admin-panel">
          <div className="navigation-bar">
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 0 ? ' active' : '')} onClick={() => this.handleChange(0)}><i className="fa fa-info"/>Details</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 1 ? ' active' : '')} onClick={() => this.handleChange(1)}><i className="fa fa-server"/>Environment</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 2 ? ' active' : '')} onClick={() => this.handleChange(2)}><i className="fa fa-list"/>Threads</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 3 ? ' active' : '')} onClick={() => this.handleChange(3)}><i className="fa fa-sliders"/>Loggers</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 4 ? ' active' : '')} onClick={() => this.handleChange(4)}><i className="fa fa-cog"/>Beans</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 5 ? ' active' : '')} onClick={() => this.handleChange(5)}><i className="fa fa-file"/>CSV Import</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 6 ? ' active' : '')} onClick={() => this.handleChange(6)}><i className="fa fa-download"/>CSV Export</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 7 ? ' active' : '')} onClick={() => this.handleChange(7)}><i className="fa fa-code"/>ID Analyze</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 8 ? ' active' : '')} onClick={() => this.handleChange(8)}><i className="fa fa-terminal"/>Execute script</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 9 ? ' active' : '')} onClick={() => this.handleChange(9)}><i className="fa fa-calendar"/>Job Management</div>
            <div className={'navigation-bar-item' + (this.state.sectionIndex === 10 ? ' active' : '')} onClick={() => this.handleChange(10)}><i className="fa fa-calendar"/>Sessions</div>
          </div>
          <div className="container">
            <SwipeableViews
              index={this.state.sectionIndex}
              onChangeIndex={this.handleChange}
            >
              <AdminDetails />
              <AdminSystemProperties />
              <AdminThreads />
              <AdminLoggers />
              <AdminSpringBeans />
              <AdminImport openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}/>
              <AdminCsvExport />
              <AdminIdAnalyzer />
              <AdminInsertScript openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}/>
              <AdminJobsManagement openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}/>
              <AdminSessions openNotificationSnackbar={this.openNotificationSnackbar.bind(this)} />
            </SwipeableViews>
          </div>
        </div>
        <NotificationSystem ref="notificationSystem"/>
      </div>
    );
  }

  handleChange = (value) => {
    this.setState({
      ...this.state,
      sectionIndex: value,
    });
  };

  openNotificationSnackbar(message, level) {
    this.notificationSystem.addNotification({
      message: message,
      level: level || 'success',
      position: 'tc'
    });
  }
}