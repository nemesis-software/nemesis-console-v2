import React, { Component } from 'react';
import { componentRequire } from '../utils/require-util'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import counterpart from 'counterpart';
injectTapEventPlugin();

counterpart.registerTranslations('en', require('../../locales/en'));
counterpart.registerTranslations('bg', require('../../locales/bg'));

counterpart.setLocale('bg');

var NavigationTree = componentRequire('app/components/navigation-tree', 'navigation-tree');

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
            <button onClick={() => {counterpart.setLocale('bg')}}>BG</button>
            <button onClick={() => {counterpart.setLocale('en')}}>EN</button>
            <NavigationTree />
        </div>
      </MuiThemeProvider>

    );
  }
}
