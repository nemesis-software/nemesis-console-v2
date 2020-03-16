import React, {Component} from 'react';
import {componentRequire} from "../../utils/require-util";
import NotificationSystem from 'react-notification-system';
import KieModules from './kie-modules';
import KieContainers from './kie-containers';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

export default class KiePanel extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = null;
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  render() {
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
        <div className="nemesis-taxonomy-panel">
          <KieModules />
          <hr/>
          <KieContainers />
        </div>
        <NotificationSystem ref="notificationSystem"/>
      </div>
    );
  }
}
