import React, { Component } from 'react';
import { componentRequire } from '../utils/require-util'
import Translate from 'react-translate-component';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import counterpart from 'counterpart';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

import '../../styles/style.less';

import 'bootstrap/dist/css/bootstrap.css';

injectTapEventPlugin();

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
    this.state = {selectedEntity: null};
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar style={{position: 'fixed'}} title="Nemesis Backend Console" iconElementRight={
            <div>
              <LanguageChanger
                labelStyle={{color: 'white'}}
                onLanguageChange={language => counterpart.setLocale(language)}
                availableLanguages={translationLanguages.languages}
                selectedLanguage={translationLanguages.defaultLanguage}
              />
              <div style={{display: 'inline-block', verticalAlign: 'top', margin: '5px 15px'}}>
                <FlatButton
                  style={{color: 'white'}}
                  label={<Translate component="span" content={'main.Logout'} fallback={'Logout'} />}
                  onTouchTap={this.handleLogoutButtonClick.bind(this)}
                />
              </div>
            </div>
          } iconStyleLeft={{display: 'none'}}/>
          <NavigationTree onEntityClick={this.onEntityClick.bind(this)}/>
          <MainView selectedEntity={this.state.selectedEntity}/>
        </div>
      </MuiThemeProvider>
    );
  }

  onEntityClick(entity) {
    this.setState({selectedEntity: entity});
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