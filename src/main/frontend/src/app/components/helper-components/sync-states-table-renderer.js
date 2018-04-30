import React, {Component} from 'react';
import Translate from 'react-translate-component';

import {nemesisFieldTypes} from '../../types/nemesis-types';

export default class SyncStateTableRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {syncStates: this.parseSyncStates(props.value)}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({syncStates: this.parseSyncStates(nextProps.value)})
  }

  render() {
    return (
      <td style={this.props.style} className="sync-state-container">
        {this.state.syncStates.map((item, index) => {
          return (item.status ?
            <div className={'status-dot' + (item.status === 'COMPLETED' ? ' green' : ' red')} key={index} title={this.getItemTitle(item)}>&nbsp;</div>
            : false)
        })}
      </td>
    )
  }


  parseSyncStates(value) {
    let result = [];
    let items = value.split(',');
    items.forEach(item => {
      let splittedItem = item.split(':');
      result.push({
        status: splittedItem[0],
        fromCatalogVersion: splittedItem[1],
        fromCatalog: splittedItem[2],
        toCatalogVersion: splittedItem[3],
        toCatalog: splittedItem[4]
      });
    });

    return result;
  }

  getItemTitle(item) {
    return `${item.fromCatalog}:${item.fromCatalogVersion} -> ${item.toCatalog}:${item.toCatalogVersion}`;
  }
}