import React, { Component } from 'react';
import {
  withRouter,
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import counterpart from 'counterpart';

import PropTypes from 'prop-types';

import ApiCall from 'servicesDir/api-call'

import _ from 'lodash';

import MasterAdmin from './master-admin/master-admin';
import AdminPanel from './admin-panel/admin-panel';
import BpmnPanel from './bpmn/bpmn-panel';
import TaxonomyPanel from './taxonomy/taxonomy-panel';
import SimpleView from './simple-view/simple-view';
import PointOfSale from './point-of-sale/point-of-sale';
import ConsoleConfigurationPanel from './console-configuration-panel/console-configuration-panel';
import NemesisSideBar from './nemesis-side-bar/nemesis-side-bar';

import 'react-select/dist/react-select.css';

import 'bootstrap/dist/css/bootstrap.css';

import '@fortawesome/fontawesome-free/css/all.css';

import 'material-design-icons/iconfont/material-icons.css'

import 'react-datetime/css/react-datetime.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/javascript/javascript';

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
    this.state = {markupData: {}, entityMarkupData: {}, sidebarData: {}, isLoadingData: true};
  }

  getChildContext() {
    return {
      markupData: this.state.markupData,
      entityMarkupData: this.state.entityMarkupData
    };
  }

  componentWillMount() {
    this.isOpenInFrame = window.location.hash.indexOf('iframePreview=true') !== -1;
    if (this.isOpenInFrame) {
      this.getMarkupData();
    } else {
      setTimeout(() => {
        this.getMarkupData();
      }, 500);
    }
  }

  getMarkupData() {
    Promise.all([ApiCall.get('markup/search/all'), ApiCall.get('markup/entity/all'), ApiCall.get('markup/sidebar')]).then(result => {
      this.setState({...this.state, markupData: result[0].data, entityMarkupData: result[1].data, sidebarData: result[2].data, isLoadingData: false});
    }, err => {
      this.setState({isLoadingData: false});
    });
  }

  render() {
    if (this.state.isLoadingData) {
      return (
        <div className="initially-loading-screen">
          <div className="nemesis-logo-container"><img src="/backend/resources/logo.svg"/></div>
          <div className="loading-text">Loading</div>
          <div className="loading-dots">
            <div className="dot">.</div>
            <div className="dot">.</div>
            <div className="dot">.</div>
          </div>
        </div>
      )
    }

    const SideBarComponent = withRouter(props => <NemesisSideBar sidebarData={this.state.sidebarData} routerProps={props}/>);

    return (
        <Router basename="/backend">
          <div>
            {!this.isOpenInFrame ? <SideBarComponent/> : false}
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
            {_.map(this.getSidebarParsedData(this.state.sidebarData), item => {
              return (
                <Route
                  key={item.code}
                  exact={true}
                  path={`/${item.code}`}
                  component={() => <SimpleView timestamp={new Date().toString()} allowedViews={item.items}/>}
                />
              )
            })}
            <Route
              exact={true}
              path={'/taxonomy'}
              component={TaxonomyPanel}
            />
            <Route
              exact={true}
              path={'/bpmn'}
              component={BpmnPanel}
            />
            <Route
              exact={true}
              path={'/maintenance'}
              component={AdminPanel}
            />
            <Route
              path={'/console-configuration'}
              component={ConsoleConfigurationPanel}
            />
          </div>
        </Router>
    );
  }

  getSidebarParsedData(sidebarData) {
    let result = [];
    _.forIn(sidebarData, (value, key) => {
      result.push({code: key, items: value})
    });

    return result;
  }
}

App.childContextTypes = {
  markupData: PropTypes.object,
  entityMarkupData: PropTypes.object
};
