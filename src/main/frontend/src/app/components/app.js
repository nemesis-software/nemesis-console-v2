import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import counterpart from 'counterpart';

import PropTypes from 'prop-types';

import ApiCall from 'servicesDir/api-call'
import QuickViewData from 'servicesDir/quick-view-helper'

import MasterAdmin from './master-admin/master-admin';
import AdminPanel from './admin-panel/admin-panel';
import RoleVIew from './role-view/role-view';
import PointOfSale from './point-of-sale/point-of-sale';
import NemesisSideBar from './nemesis-side-bar/nemesis-side-bar';

import 'react-select/dist/react-select.css';

import 'bootstrap/dist/css/bootstrap.css';

import 'font-awesome/css/font-awesome.css';

import 'react-datetime/css/react-datetime.css';

import '../../styles/style.less';

require('es6-promise').polyfill();

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
    this.state = {markupData: {}, entityMarkupData: {}, quickViewData: {}, isLoadingData: true};
  }

  getChildContext() {
    return {
      markupData: this.state.markupData,
      entityMarkupData: this.state.entityMarkupData,
      quickViewData: this.state.quickViewData
    };
  }

  componentWillMount() {
    Promise.all([ApiCall.get('markup/search/all'), ApiCall.get('markup/entity/all')]).then(result => {
      this.setState({...this.state, markupData: result[0].data, entityMarkupData: result[1].data, quickViewData: QuickViewData, isLoadingData: false});
    });
    this.isOpenInFrame = window.location.hash.indexOf('iframePreview=true') !== -1;
  }

  render() {
    if (this.state.isLoadingData) {
      return (
        <div>Loading</div>
      )
    }

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
              path={'/pos'}
              component={PointOfSale}
            />
            <Route
              exact={true}
              path={'/content'}
              component={() => <RoleVIew timestamp={new Date().toString()} allowedViews={['blog_entry', 'widget']}/>}
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

App.childContextTypes = {
  markupData: PropTypes.object,
  entityMarkupData: PropTypes.object,
  quickViewData: PropTypes.object,
};