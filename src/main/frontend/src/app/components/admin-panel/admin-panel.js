import React, {Component} from 'react';
import '../../../styles/admin-panel.less';
import AdminImport from './admin-import';
import AdminSpringBeans from './admin-spring-beans';
import AdminIdAnalyzer from './admin-id-analyzer';
import AdminSystemProperties from './admin-system-properties/admin-system-properties';
import AdminThreads from './admin-threads/admin-threads'
import AdminDetails from './admin-details/admin-details';
import AdminLoggers from './admin-loggers/admin-loggers';
import AdminInsertScript from './admin-insert-script';
import AdminJobsManagement from './admin-jobs-management/admin-jobs-management';
import SwipeableViews from 'react-swipeable-views';

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { sectionIndex: 0};

  }

  render() {
    return (
      <div className="nemesis-admin-panel container">
        <ul className="navigation-bar">
          <li className={this.state.sectionIndex === 0 ? 'active' : ''} onClick={() => this.handleChange(0)}><i className="fa fa-info"/>Details</li>
          <li className={this.state.sectionIndex === 1 ? 'active' : ''} onClick={() => this.handleChange(1)}><i className="fa fa-server"/>Environment</li>
          <li className={this.state.sectionIndex === 2 ? 'active' : ''} onClick={() => this.handleChange(2)}><i className="fa fa-list"/>Threads</li>
          <li className={this.state.sectionIndex === 3 ? 'active' : ''} onClick={() => this.handleChange(3)}><i className="fa fa-sliders"/>Loggers</li>
          <li className={this.state.sectionIndex === 4 ? 'active' : ''} onClick={() => this.handleChange(4)}><i className="fa fa-cog"/>Beans</li>
          <li className={this.state.sectionIndex === 5 ? 'active' : ''} onClick={() => this.handleChange(5)}><i className="fa fa-file"/>Import</li>
          <li className={this.state.sectionIndex === 6 ? 'active' : ''} onClick={() => this.handleChange(6)}><i className="fa fa-code"/>ID Analyze</li>
          <li className={this.state.sectionIndex === 7 ? 'active' : ''} onClick={() => this.handleChange(7)}><i className="fa fa-terminal"/>Insert Script</li>
          <li className={this.state.sectionIndex === 8 ? 'active' : ''} onClick={() => this.handleChange(8)}><i className="fa fa-calendar"/>Job Management</li>
        </ul>
        <SwipeableViews
          index={this.state.sectionIndex}
          onChangeIndex={this.handleChange}
        >
          <AdminDetails />
          <AdminSystemProperties />
          <AdminThreads />
          <AdminLoggers />
          <AdminSpringBeans />
          <AdminImport openNotificationSnackbar={this.props.openNotificationSnackbar}/>
          <AdminIdAnalyzer />
          <AdminInsertScript openNotificationSnackbar={this.props.openNotificationSnackbar}/>
          <AdminJobsManagement openNotificationSnackbar={this.props.openNotificationSnackbar}/>
        </SwipeableViews>
      </div>
    );
  }

  handleChange = (value) => {
    this.setState({
      ...this.state,
      sectionIndex: value,
    });
  };
}