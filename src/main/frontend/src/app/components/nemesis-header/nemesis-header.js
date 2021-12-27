import React, { Component } from 'react';

import PlatformApiCall from '../../services/platform-api-call';
import NotificationSystem from 'react-notification-system';
import DataHelper from 'servicesDir/data-helper'
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import PropTypes from "prop-types";
import webstomp from 'webstomp-client';
import SockJS from 'sockjs-client';

import LiveEditNavigation from '../live-edit-navigation';
import Notifications from '../notifications';

import { componentRequire } from '../../utils/require-util'

let LanguageChanger = componentRequire('app/components/language-changer', 'language-changer');
import GlobalFilter from './global-filter';
import ApiCall from '../../services/api-call'

export default class NemesisHeader extends Component {
  constructor(props, context) {
  debugger;
    super(props);
    this.connected = false;
    this.socketClient = null;
    this.state = {notifications: [], sites:[], markupLocales: context.markupLocales};
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
        
    this.stomp = new Promise(resolve => {
        var socketClient = webstomp.over(new SockJS(document.getElementById('website-base-url').getAttribute('url') + 'platform/stomp', null, {timeout:15000}));
        socketClient.connect({'X-Nemesis-Token' : document.getElementById('token').getAttribute('value')}, () => resolve(socketClient));
    });

    var self = this;
    this.stomp.then(socketClient => {
        socketClient.subscribe('/topic/notifications', function onReceive(notification) {
            var badgeCounter = document.getElementById('badge-counter');
            var numberOfNotifications = badgeCounter.innerHTML;
            numberOfNotifications++;
            badgeCounter.innerHTML = numberOfNotifications;
            var newNotifications = self.state.notifications;
            newNotifications.push(JSON.parse(notification.body));
            self.setState({notifications: newNotifications});
        }, {});
    });

    ApiCall.get('site').then(result => {
      this.setState({sites: DataHelper.mapCollectionData(result.data)})
    })
  }

  render() {
      if (!this.props.isOpenInFrame) {
        return (
          <div className="nemesis-navbar">
            <i className="fa fa-bars nemesis-navbar-icon" onClick={() => this.props.onRightIconButtonClick()}/>
            <div className="nemesis-navbar-header">Nemesis Console</div>
            <div className="nemesis-navbar-right">
              <Notifications notifications={this.state.notifications} clearNotifications={this.clearNotifications} />
              {this.props.onGlobalFilterSelect ? <GlobalFilter onGlobalFilterSelect={this.props.onGlobalFilterSelect}/> : false}
              {(this.state.sites.length > 0) ? <LiveEditNavigation sites={this.state.sites}/>: ''}
              <LanguageChanger
                style={{width: '150px'}}
                selectClassName="header-language-changer"
                onLanguageChange={language => counterpart.setLocale(language)}
                availableLanguages={this.state.markupLocales.languages}
                selectedLanguage={this.state.markupLocales.defaultLanguage}
              />
              <div className="logout-button" onClick={this.handleLogoutButtonClick.bind(this)}>
                <i className="fa fa-sign-out-alt logout-icon"/> <Translate component="span" content={'main.Logout'} fallback={'Log out'} />
              </div>
            </div>
          </div>
        )
      } else {
        return false;
      }
  }
  
  clearNotifications = () => {
    var badgeCounter = document.getElementById('badge-counter');
    badgeCounter.innerHTML = '';
  };

  handleLogoutButtonClick() {
    let csrfToken = document.getElementById('security').getAttribute('token');
    let contextPath = document.getElementById('contextPath').getAttribute('ctxPath');
    let form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', `${contextPath}/j_spring_security_logout`);
    let hiddenField = document.createElement("input");
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', '_csrf');
    hiddenField.setAttribute('value', csrfToken);

    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}

NemesisHeader.contextTypes = {
  markupLocales: PropTypes.object
};
