import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import counterpart from 'counterpart';

import MasterAdmin from './master-admin/master-admin';
import AdminPanel from './admin-panel/admin-panel';
import RoleVIew from './role-view/role-view';
import NemesisSideBar from './nemesis-side-bar/nemesis-side-bar';

import 'react-select/dist/react-select.css';

import 'bootstrap/dist/css/bootstrap.css';

import 'font-awesome/css/font-awesome.css';

import 'react-datetime/css/react-datetime.css';

import '../../styles/style.less';

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

export default class App extends Component {
  constructor(props) {
    super(props);
    this.isOpenInFrame = false;
  }

  componentWillMount() {
    this.isOpenInFrame = window.location.hash.indexOf('iframePreview=true') !== -1;
  }

  render() {
    return (
        <Router basename="/backend">
          <div>
            <NemesisSideBar />
            <Route
              exact={true}
              path={'/'}
              component={MasterAdmin}
            />
            <Route
              exact={true}
              path={'/content'}
              component={() => <RoleVIew allowedViews={['blog_entry', 'widget']}/>}
            />
            <Route
              exact={true}
              path={'/maintenance'}
              component={AdminPanel}
            />
          </div>
        </Router>
    );
  }
}