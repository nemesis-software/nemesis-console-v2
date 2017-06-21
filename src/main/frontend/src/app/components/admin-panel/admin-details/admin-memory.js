import React from 'react';
import AdminExpandable from '../admin-expandable';
import _ from 'lodash';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';


export default class AdminMemory extends AdminExpandable {
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
          <div className="display-table-cell">
            <div>Memory ({this.props.data['mem.free']} / {this.props.data['mem']})</div>
            <ProgressBar bsStyle="success" now={this.getMemoryPercents(this.props.data['mem.free'], this.props.data['mem'])} label={this.getMemoryPercents(this.props.data['mem.free'], this.props.data['mem']) + '%'} />
          </div>
        </div>

        <div className="display-table-row">
          <div className="display-table-cell">
            <div>Heap Memory ({this.props.data['heap'] - this.props.data['heap.used']} / {this.props.data['heap']})</div>
            <ProgressBar bsStyle="success" now={this.getMemoryPercents(this.props.data['heap'] - this.props.data['heap.used'], this.props.data['heap'])} label={this.getMemoryPercents(this.props.data['heap'] - this.props.data['heap.used'], this.props.data['heap']) + '%'} />
          </div>
        </div>

        <div className="display-table-row">
          <div className="display-table-cell">Initial Heap (-Xms)</div>
          <div className="display-table-cell">{this.props.data['heap.init']}</div>
        </div>
        <div className="display-table-row">
          <div className="display-table-cell">Maximum Heap (-Xmx)</div>
          <div className="display-table-cell">{this.props.data['heap.committed']}</div>
        </div>

      </div>
    );
  }

  getHeaderText() {
    return 'Memory';
  }

  getMemoryPercents(freeMemory, allMemory) {
   return Math.round((freeMemory / allMemory) * 100);
  }
}