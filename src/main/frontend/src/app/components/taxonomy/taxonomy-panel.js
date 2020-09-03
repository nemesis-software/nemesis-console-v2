import React, { Component } from 'react';
import '../../../styles/taxonomy-panel.less';
import Taxons from './taxons';
import Taxonomables from './taxonomables';
import { componentRequire } from "../../utils/require-util";
import NotificationSystem from 'react-notification-system';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

export default class TaxonomyPanel extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = null;
  }

  render() {
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => { }} isOpenInFrame={this.isOpenInFrame} />
        <div className="nemesis-taxonomy-panel">
          <div style={{ display: 'block' }}>
            <Taxons />
          </div>
          <hr />
          <div style={{ display: 'block' }}>
            <Taxonomables />
          </div>
        </div>
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }
}
