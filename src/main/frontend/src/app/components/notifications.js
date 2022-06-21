import React, { Component } from 'react';

import ApiCall from '../services/api-call';
import NotificationModal from './NotificationModal.js';
import { Dropdown } from 'react-bootstrap';

import DataHelper from 'servicesDir/data-helper';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = { notifications: [], showNotificationModal: false };
    this.handleNotificationModalClose = this.handleNotificationModalClose.bind(this);
    this.handleNotificationModalShow = this.handleNotificationModalShow.bind(this);
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({ notifications: this.props.notifications });
  }

  componentDidMount() {
    document.getElementById("live-edit-sites").addEventListener("click", this.props.clearNotifications);
  };

  render() {
    return (
    <>
      <Dropdown id="live-edit-sites" className="notifications-dropdown">
        <Dropdown.Toggle className="notification-toggle">
          <div className="notification-dropdown-content"><i className="fas fa-bell fa-fw" /> Notifications <span id="badge-counter" className="badge badge-danger badge-counter"></span> <i className="material-icons arrow-icon">keyboard_arrow_down</i></div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.state.notifications.map((notification, index) => {
            var textCss = '';
            switch(notification.status) {
                case 'FAILED':
                case 'ABANDONED':
                    textCss='text-danger';
                    break;
                case 'COMPLETED':
                    textCss='text-success';
                    break;
            }

            return <Dropdown.Item key={index}>
              <div className={'notification-container ' + textCss} onClick={() => this.handleNotificationModalShow(notification)}>
                <span className="cronjob"><i className={"fa " + notification.icon} aria-hidden="true"></i></span>
                <div>
                  <div><b>{notification.message}</b><br /></div>
                  <div>{notification.description}</div>
                </div>
              </div>
            </Dropdown.Item>
          })}
        </Dropdown.Menu>
      </Dropdown>
      <NotificationModal show={this.state.showNotificationModal} handleNotificationModalClose={this.handleNotificationModalClose} notification={this.state.selectedNotification}/>
      </>
    );
  }

  handleNotificationModalClose() {
      this.setState({
          showNotificationModal: false
      });
  }
  handleNotificationModalShow(notification) {
      this.setState({
          showNotificationModal: true,
          selectedNotification: notification
      });
  }
}
