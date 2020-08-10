import React, { Component } from 'react';

import { Route, Link, BrowserRouter, Switch } from 'react-router-dom';

import { componentRequire } from '../../utils/require-util'

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
    const contextPath = document.getElementById('contextPath').innerText;
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => { }} />
        <div className="console-configuration-panel">
          <BrowserRouter>
            <Switch>
              <Route exact={true} path={`${contextPath}/console-configuration`} component={() => (
                <div className="console-configuration-wrapper">
                  <Link to={`${contextPath}/console-configuration/masterAdmin`}><div className="configuration-type-box"><i className="fa fa-crown"></i><div>Master</div></div></Link>
                  <Link to={`${contextPath}/console-configuration/navigationAdmin`}><div className="configuration-type-box"><i className="fa fa-sitemap"></i><div>Navigation</div></div></Link>
                  <Link to={`${contextPath}/console-configuration/sidebarAdmin`}><div className="configuration-type-box"><i className="fa fa-ellipsis-v"></i><div>Sidebar</div></div></Link>
                  <Link to={`${contextPath}/console-configuration/permissionConfig`}><div className="configuration-type-box"><i className="fa fa-user-shield"></i><div>Permissions</div></div></Link>
                </div>
              )} />
              <Route path={`${contextPath}/console-configuration/masterAdmin`} >
                <AllFieldsConfiguration openNotificationSnackbar={this.openNotificationSnackbar.bind(this)} />
              </Route>
              <Route path={`${contextPath}/console-configuration/navigationAdmin`}>
                <MasterAdminNavigationConfiguration openNotificationSnackbar={this.openNotificationSnackbar.bind(this)} />
              </Route>
              <Route path={`${contextPath}/console-configuration/sidebarAdmin`} >
                <SidebarAdminConfiguration openNotificationSnackbar={this.openNotificationSnackbar.bind(this)} />
              </Route>
              <Route path={`${contextPath}/console-configuration/permissionConfig`} >
                <AdminPermissionConfiguration openNotificationSnackbar={this.openNotificationSnackbar.bind(this)} />
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
        <NotificationSystem ref="notificationSystem" />
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
