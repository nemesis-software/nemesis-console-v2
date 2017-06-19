import React from 'react';
import AdminExpandable from '../admin-expandable';
import _ from 'lodash';

export default class AdminJVM extends AdminExpandable {
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
          <div className="display-table-cell">Uptime</div>
          <div className="display-table-cell">{this.props.data.uptime}</div>
        </div>

        <div className="display-table-row">
          <div className="display-table-cell">Systemload</div>
          <div className="display-table-cell">{this.props.data['systemload.average']}</div>
        </div>

        <div className="display-table-row">
          <div className="display-table-cell">Available Processors</div>
          <div className="display-table-cell">{this.props.data['processors']}</div>
        </div>


        <div className="display-table-row">
          <div className="display-table-cell">Classes</div>
          <div className="display-table-cell">
            <div className="display-table" style={{width: '100%'}}>
              <div className="display-table-row">
                <div className="display-table-cell">current loaded</div>
                <div className="display-table-cell">{this.props.data['classes.loaded']}</div>
              </div>
              <div className="display-table-row">
                <div className="display-table-cell">total loaded</div>
                <div className="display-table-cell">{this.props.data['classes']}</div>
              </div>
              <div className="display-table-row">
                <div className="display-table-cell">unloaded</div>
                <div className="display-table-cell">{this.props.data['classes.unloaded']}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="display-table-row">
          <div className="display-table-cell">Threads</div>
          <div className="display-table-cell">
            <div className="display-table" style={{width: '100%'}}>
              <div className="display-table-row">
                <div className="display-table-cell">current</div>
                <div className="display-table-cell">{this.props.data['threads']}</div>
              </div>
              <div className="display-table-row">
                <div className="display-table-cell">total started</div>
                <div className="display-table-cell">{this.props.data['threads.totalStarted']}</div>
              </div>
              <div className="display-table-row">
                <div className="display-table-cell">daemon</div>
                <div className="display-table-cell">{this.props.data['threads.daemon']}</div>
              </div>
              <div className="display-table-row">
                <div className="display-table-cell">peak</div>
                <div className="display-table-cell">{this.props.data['threads.peak']}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getHeaderText() {
    return 'JVM';
  }
}