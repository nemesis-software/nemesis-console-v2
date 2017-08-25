import React, { Component } from 'react';
import { componentRequire } from '../utils/require-util'
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import 'react-select/dist/react-select.css';

import 'bootstrap/dist/css/bootstrap.css';

import 'font-awesome/css/font-awesome.css';

import 'react-datetime/css/react-datetime.css';

import '../../styles/style.less';

import LiveEditNavigation from './live-edit-navigation';

const translationLanguages = {
 languages: [
   {value: 'en', labelCode: 'English'},
   {value: 'bg', labelCode: 'Bulgarian'},
 ],
 defaultLanguage: {value: 'en', labelCode: 'English'}
};

translationLanguages.languages.forEach(language => {
  let languageValue = language.value;
  counterpart.registerTranslations(languageValue, require('localesDir/' + languageValue));
});

counterpart.setLocale(translationLanguages.defaultLanguage.value);

let NavigationTree = componentRequire('app/components/navigation-tree/navigation-tree', 'navigation-tree');
let MainView = componentRequire('app/components/main-view/main-view', 'main-view');
let LanguageChanger = componentRequire('app/components/language-changer', 'language-changer');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.mainViewRef = null;
    this.state = {isNavigationTreeOpened: true};
    this.isOpenInFrame = false;
  }

  componentWillMount() {
    this.isOpenInFrame = window.location.hash.indexOf('iframePreview=true') !== -1;
  }

  render() {
    return (
        <div>
          {!this.isOpenInFrame ? <div className="nemesis-navbar">
            <i className="fa fa-bars sidebar-icon" onClick={() => this.setState({isNavigationTreeOpened: !this.state.isNavigationTreeOpened})}/>
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
          </div> : false }
          {!this.isOpenInFrame ? <div className={this.state.isNavigationTreeOpened ? 'navigation-tree' : 'navigation-tree hidden-tree'}>
            <NavigationTree onEntityClick={this.onEntityClick.bind(this)}/>
          </div> : false }
          <div className={this.getMainViewClasses()}>
            <MainView ref={el => {this.mainViewRef = el}}/>
          </div>
        </div>
    );
  }

  onEntityClick(entity) {
    this.mainViewRef.openNewEntity(entity)
  }

  getMainViewClasses() {
    let mainClass = 'main-view-wrapper';

    if (this.isOpenInFrame) {
      return mainClass + ' iframe-view';
    }

    if (!this.state.isNavigationTreeOpened) {
      return mainClass + ' full-view';
    }

    return mainClass;
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