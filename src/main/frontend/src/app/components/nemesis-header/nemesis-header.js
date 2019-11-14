import React, { Component } from 'react';

import PlatformApiCall from '../../services/platform-api-call';

import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import webstomp from 'webstomp-client';
import SockJS from 'sockjs-client';

import LiveEditNavigation from '../live-edit-navigation';

import { componentRequire } from '../../utils/require-util'

let LanguageChanger = componentRequire('app/components/language-changer', 'language-changer');
import GlobalFilter from './global-filter';

const translationLanguages = {
  languages: [
    {value: 'en', labelCode: 'English'},
    {value: 'bg', labelCode: 'Bulgarian'},
  ],
  defaultLanguage: {value: 'en', labelCode: 'English'}
};

export default class NemesisHeader extends Component {
  constructor(props) {
    super(props);
    this.socketClient = null;
  }

    componentWillMount() {
      this.socketClient = webstomp.over(new SockJS(PlatformApiCall.get('/stomp/log')));
      this.socketClient.connect({}, frame => {
        console.log(frame)
      }, err => {
        console.log(err);
      })
    }

  render() {
      if (!this.props.isOpenInFrame) {
        return (
          <div className="nemesis-navbar">
            <i className="fa fa-bars nemesis-navbar-icon" onClick={() => this.props.onRightIconButtonClick()}/>
            <div className="nemesis-navbar-header">Nemesis Console1</div>
            <div className="nemesis-navbar-right">
            </div>
            <div className="nemesis-navbar-right">
              {this.props.onGlobalFilterSelect ? <GlobalFilter onGlobalFilterSelect={this.props.onGlobalFilterSelect}/> : false}
              <LiveEditNavigation/>
              <LanguageChanger
                style={{width: '150px'}}
                selectClassName="header-language-changer"
                onLanguageChange={language => counterpart.setLocale(language)}
                availableLanguages={translationLanguages.languages}
                selectedLanguage={translationLanguages.defaultLanguage}
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
