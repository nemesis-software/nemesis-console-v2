import React from 'react';
import AdminExpandable from '../admin-expandable';
import _ from 'lodash';

export default class AdminGC extends AdminExpandable {
  constructor(props) {
    super(props);
  }

  getExpandedContent() {
    if (_.isEmpty(this.props.data)) {
      return <div></div>
    }

    return (
      <div style={{width: '100%'}} className="display-table">
        <div className="display-table-row">
          <div className="display-table-cell">PS scavenge</div>
          <div className="display-table-cell">
            <div className="display-table" style={{width: '100%'}}>
              <div className="display-table-row">
                <div className="display-table-cell">Count</div>
                <div className="display-table-cell">{this.props.data['gc.ps_scavenge.count']}</div>
              </div>
              <div className="display-table-row">
                <div className="display-table-cell">Time</div>
                <div className="display-table-cell">{this.props.data['gc.ps_scavenge.time']}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="display-table-row">
          <div className="display-table-cell">PS marksweep</div>
          <div className="display-table-cell">
            <div className="display-table" style={{width: '100%'}}>
              <div className="display-table-row">
                <div className="display-table-cell">Count</div>
                <div className="display-table-cell">{this.props.data['gc.ps_marksweep.count']}</div>
              </div>
              <div className="display-table-row">
                <div className="display-table-cell">Time</div>
                <div className="display-table-cell">{this.props.data['gc.ps_marksweep.time']}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getHeaderText() {
    return 'Garbage Collection';
  }
}