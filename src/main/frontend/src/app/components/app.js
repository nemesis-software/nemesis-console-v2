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
import ThemeEditorPanel from './theme-editor-panel/theme-editor-panel';
import BpmnPanel from './bpmn/bpmn-panel';
import DmnPanel from './dmn/dmn-panel';
import KiePanel from './kie/kie-panel';
import RulesPanel from './rules/rules-panel';
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
            <div>
                <div className="vertical-centered-box">
                  <div className="content">
                    <div className="loader-circle"></div>
                    <div className="loader-line-mask">
                      <div className="loader-line"></div>
                    </div>
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="60px"
                    height="60px" viewBox="0 0 79.999 80" enableBackground="new 0 0 79.999 80" xmlSpace="preserve">
                      <path fill="#FFFFFF" d="M10.926,20.067c0-2.651,1.583-5.02,4.032-6.034c2.449-1.015,5.243-0.459,7.118,1.415L59.726,53.1V37.647  L29.801,7.723c-5.01-5.011-12.478-6.497-19.024-3.785C4.23,6.65,0,12.981,0,20.067v57.082V80l21.517-21.518l-1.243-1.244  l-9.348,7.892V20.067z"/>
                      <path fill="#FFFFFF" d="M69.074,59.934c0,2.65-1.584,5.02-4.033,6.033c-2.448,1.016-5.242,0.459-7.117-1.414l-37.65-37.651v15.452  l29.925,29.924c5.01,5.011,12.478,6.496,19.023,3.785C75.769,73.35,80,67.02,80,59.934V2.851V0L58.482,21.517l1.243,1.244  l9.349-7.891V59.934z"/>
                    </svg>
                  </div>
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
              path={'/theme'}
              component={ThemeEditorPanel}
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
              path={'/kie'}
              component={KiePanel}
            />
            <Route
              exact={true}
              path={'/dmn'}
              component={DmnPanel}
            />
            <Route
              exact={true}
              path={'/brm'}
              component={RulesPanel}
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
