import React, { Component } from 'react';
import { componentRequire } from '../../utils/require-util'
import PropTypes from "prop-types";

let NavigationTree = componentRequire('app/components/navigation-tree/navigation-tree', 'navigation-tree');
let MainView = componentRequire('app/components/main-view/main-view', 'main-view');
let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

const keyPrefix = 'masterAdmin';

export default class MasterAdmin extends Component {
  constructor(props, context) {
    super(props);
    this.mainViewRef = null;
    this.isOpenInFrame = false;
    this.state = {isNavigationTreeOpened: true, globalFiltersCatalogs: [], key: keyPrefix + Date.now()};
  }

  componentWillMount() {
    this.isOpenInFrame = window.location.hash.indexOf('iframePreview=true') !== -1;
  }

  getChildContext() {
    return {
      globalFiltersCatalogs: this.state.globalFiltersCatalogs
    };
  }

  render() {
    return (
      <div >
        <NemesisHeader onGlobalFilterSelect={this.onGlobalFilterSelect.bind(this)} onRightIconButtonClick={() => this.setState({isNavigationTreeOpened: !this.state.isNavigationTreeOpened})} isOpenInFrame={this.isOpenInFrame}/>
        {!this.isOpenInFrame ? <div className={this.state.isNavigationTreeOpened ? 'navigation-tree' : 'navigation-tree hidden-tree'}>
          <NavigationTree onEntityClick={this.onEntityClick.bind(this)}/>
        </div> : false }
        <div className={this.getMainViewClasses()} key={this.state.key}>
          <MainView ref={el => {this.mainViewRef = el}} />
        </div>
      </div>
    );
  }

  onGlobalFilterSelect(response) {
    response.then(result => {
      window.location.hash = '#';
      this.setState({globalFiltersCatalogs: result.data.map(item => {
        return {
          id: item.id,
          code: item.code,
          catalogVersion: `${item.catalog.code}:${item.code}`
        }
        }), key: keyPrefix + Date.now()});
    })
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
}

MasterAdmin.contextTypes = {
  markupConfig: PropTypes.object
};

MasterAdmin.childContextTypes = {
  markupConfig: PropTypes.object,
  globalFiltersCatalogs: PropTypes.array
};
