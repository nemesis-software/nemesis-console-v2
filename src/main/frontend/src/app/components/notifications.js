import React, { Component } from 'react';

import ApiCall from '../services/api-call';

import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import DataHelper from 'servicesDir/data-helper';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {notifications: []};
  }

  componentWillReceiveProps() {
    this.setState({notifications: this.props.notifications});
  }

  render() {
    return (
    <Dropdown id="live-edit-sites" className="notifications-dropdown">
      <Dropdown.Toggle className="notification-toggle" noCaret>
        <div className="notification-dropdown-content"><i className="fas fa-bell fa-fw" /> Notifications <span id="badge-counter" className="badge badge-danger badge-counter"></span> <i className="material-icons arrow-icon">keyboard_arrow_down</i></div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="notifications">
          {this.state.notifications.map((notification, index) => {
            return <MenuItem key={index}><b>{notification.message}</b><br/>{notification.description}</MenuItem>
          })}
      </Dropdown.Menu>
    </Dropdown>
    );
  }
}
