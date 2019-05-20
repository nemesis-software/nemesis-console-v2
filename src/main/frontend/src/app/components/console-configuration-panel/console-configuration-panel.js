import React, {Component} from 'react';

import { Route, Link } from 'react-router-dom';

import {componentRequire} from '../../utils/require-util'

import AllFieldsConfiguration from './all-fields-configuration/all-fields-configuration';

import SidebarAdminConfiguration from './sidebar-admin-configuration/sidebar-admin-configuration';
import AdminPermissionConfiguration from './admin-permission-configuration/admin-permission-configuration'

import NotificationSystem from 'react-notification-system';
import MasterAdminNavigationConfiguration from "./master-admin-navigation-configuration/master-admin-navigation-configuration";

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

export default class ConsoleConfigurationPanel extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = null;
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  render() {
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => {}}/>
        <div className="console-configuration-panel">
          <Route exact={true} path={this.props.match.path} component={() => (
            <div className="console-configuration-wrapper">
              <Link to={`${this.props.match.path}/masterAdmin`}><div className="configuration-type-box"><i className="fa fa-crown"></i><div>Master</div></div></Link>
              <Link to={`${this.props.match.path}/navigationAdmin`}><div className="configuration-type-box"><i className="fa fa-sitemap"></i><div>Navigation</div></div></Link>
              <Link to={`${this.props.match.path}/sidebarAdmin`}><div className="configuration-type-box"><i className="fa fa-ellipsis-v"></i><div>Sidebar</div></div></Link>
              <Link to={`${this.props.match.path}/permissionConfig`}><div className="configuration-type-box"><i className="fa fa-user-shield"></i><div>Permissions</div></div></Link>
            </div>
          )}/>
          <Route path={`${this.props.match.path}/masterAdmin`} component={() => <AllFieldsConfiguration openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}/>} />
          <Route path={`${this.props.match.path}/navigationAdmin`} component={() => <MasterAdminNavigationConfiguration openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}/>} />
          <Route path={`${this.props.match.path}/sidebarAdmin`} component={() => <SidebarAdminConfiguration openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}/>} />
          <Route path={`${this.props.match.path}/permissionConfig`} component={() => <AdminPermissionConfiguration openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}/>} />
        </div>
        <NotificationSystem ref="notificationSystem"/>
      </div>
    )
  }

  openNotificationSnackbar(message, level) {
    this.notificationSystem.addNotification({
      message: message,
      level: level || 'success',
      position: 'tc'
    });
  }
}
