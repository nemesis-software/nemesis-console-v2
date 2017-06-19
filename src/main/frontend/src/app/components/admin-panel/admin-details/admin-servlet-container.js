import React from 'react';
import AdminExpandable from '../admin-expandable';
import _ from 'lodash';

export default class AdminServletContainer extends AdminExpandable {
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
          <div className="display-table-cell">Http sessions</div>
          <div className="display-table-cell">
            <div className="display-table" style={{width: '100%'}}>
              <div className="display-table-row">
                <div className="display-table-cell">Active</div>
                <div className="display-table-cell">{this.props.data['httpsessions.active']}</div>
              </div>
              <div className="display-table-row">
                <div className="display-table-cell">Maximum</div>
                <div className="display-table-cell">{this.props.data['httpsessions.max']}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  getHeaderText() {
    return 'Servlet Container';
  }
}