import React, { Component } from 'react';

import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import LiveEditNavigation from '../live-edit-navigation';

import { componentRequire } from '../../utils/require-util'

let LanguageChanger = componentRequire('app/components/language-changer', 'language-changer');

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
  }

  render() {
      if (!this.props.isOpenInFrame) {
        return (
          <div className="nemesis-navbar">
            <i className="fa fa-bars nemesis-navbar-icon" onClick={() => this.props.onRightIconButtonClick()}/>
            <div className="nemesis-navbar-header">Nemesis Console</div>
            <div className="nemesis-navbar-right">
              <LiveEditNavigation/>
              <LanguageChanger
                style={{width: '150px'}}
                selectClassName="header-language-changer"
                onLanguageChange={language => counterpart.setLocale(language)}
                availableLanguages={translationLanguages.languages}
                selectedLanguage={translationLanguages.defaultLanguage}
              />
              <div className="logout-button" onClick={this.handleLogoutButtonClick.bind(this)}>
                <i className="fa fa-sign-out logout-icon"/> <Translate component="span" content={'main.Logout'} fallback={'Log out'} />
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
    let form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', 'j_spring_security_logout');
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