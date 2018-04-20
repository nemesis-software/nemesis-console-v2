import React, { Component } from 'react';
import { componentRequire } from '../../utils/require-util'

let NavigationTree = componentRequire('app/components/navigation-tree/navigation-tree', 'navigation-tree');
let MainView = componentRequire('app/components/main-view/main-view', 'main-view');
let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

export default class MasterAdmin extends Component {
  constructor(props) {
    super(props);
    this.mainViewRef = null;
    this.isOpenInFrame = false;
    this.state = {isNavigationTreeOpened: true};
  }

  componentWillMount() {
    this.isOpenInFrame = window.location.hash.indexOf('iframePreview=true') !== -1;
  }

  render() {
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => this.setState({isNavigationTreeOpened: !this.state.isNavigationTreeOpened})} isOpenInFrame={this.isOpenInFrame}/>
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
}