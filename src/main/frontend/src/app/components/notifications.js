import React, { Component } from 'react';

import ApiCall from '../services/api-call';

import { Dropdown } from 'react-bootstrap';

import DataHelper from 'servicesDir/data-helper';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = { notifications: [] };
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({ notifications: this.props.notifications });
  }

  componentDidMount() {
    document.getElementById("live-edit-sites").addEventListener("click", this.props.clearNotifications);
  };

  render() {
    return (
      <Dropdown id="live-edit-sites" className="notifications-dropdown">
        <Dropdown.Toggle className="notification-toggle">
          <div className="notification-dropdown-content"><i className="fas fa-bell fa-fw" /> Notifications <span id="badge-counter" className="badge badge-danger badge-counter"></span> <i className="material-icons arrow-icon">keyboard_arrow_down</i></div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.state.notifications.map((notification, index) => {
            return <Dropdown.Item key={index}>
              <div className='notification-container'>
                <span className="cronjob"><i class="fa fa-tasks" aria-hidden="true"></i></span>
                <div>
                  <div><b>{notification.message}</b><br /></div>
                  <div>{notification.description}</div>
                </div>
              </div>
            </Dropdown.Item>
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
