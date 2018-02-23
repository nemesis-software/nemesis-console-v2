import React from 'react';
import AdminExpandable from '../admin-expandable';
import _ from 'lodash';

export default class AdminSystemPropertiesExpandable extends AdminExpandable {
  constructor(props) {
    super(props);
    this.state = {isExpanded: true}
  }

  getSystemProperties() {
    let result = [];
    _.forIn(this.props.properties, (value, key) => {
      result.push({value: value, key: key});
    });
    return result;
  }

  getExpandedContent() {
    return (
      <div>
        <table style={{width: '100%', tableLayout: 'fixed'}} className="table table-striped">
          <tbody>
          {_.map(this.getSystemProperties(), (item, index) => {
            return (
              <tr key={index}>
                <td style={{wordWrap: 'break-word'}}>{item.key}</td>
                <td style={{wordWrap: 'break-word'}}>{item.value}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }
}