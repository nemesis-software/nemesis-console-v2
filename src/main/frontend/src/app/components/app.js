import React, { Component } from 'react';
import { componentRequire } from '../utils/require-util'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import counterpart from 'counterpart';
import AppBar from 'material-ui/AppBar';

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

let NavigationTree = componentRequire('app/components/nemesis-navigation-tree/nemesis-navigation-tree', 'navigation-tree');
let LanguageChanger = componentRequire('app/components/language-changer', 'language-changer');

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="Nemesis Console" iconElementRight={
            <LanguageChanger
              onLanguageChange={language => counterpart.setLocale(language)}
              availableLanguages={translationLanguages.languages}
              selectedLanguage={translationLanguages.defaultLanguage}
            />
          }/>
          <NavigationTree />
        </div>
      </MuiThemeProvider>
    );
  }
}
