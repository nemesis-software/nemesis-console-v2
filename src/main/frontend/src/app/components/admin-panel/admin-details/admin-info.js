import React from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import AdminExpandable from '../admin-expandable';
import _ from 'lodash';

const headerStyle = {
  padding: '5px 10px',
  background: 'white',
  fontWeight: 'bold'
};

export default class AdminInfo extends AdminExpandable {
  constructor(props) {
    super(props);
    this.state = {data: [], isExpanded: true};
  }

  componentDidMount() {
    PlatformApiCall.get('info').then(result => {
      this.setState({...this.state, data: result.data})
    });
  }

  getExpandedContent() {
    return (
      <div>
        <div>
          <div style={headerStyle}>Platform</div>
          <div style={{width: '100%'}} className="display-table">
            {this.getRenderDataObject(this.state.data.platform)}
          </div>
        </div>
        <div>
          <div style={headerStyle}>Application</div>
          <div style={{width: '100%'}} className="display-table">
            {this.getRenderDataObject(this.state.data.app)}
          </div>
        </div>
      </div>
    );
  }

  getRenderDataObject(data) {
    let result = [];
    _.forIn(data, (value, key) => {
      result.push(
        <div key={key} className="display-table-row">
          <div className="display-table-cell">{key}</div>
          <div className="display-table-cell">{value}</div>
        </div>
      )
    });

    return result;
  }

  getHeaderText() {
    return 'Info';
  }
}