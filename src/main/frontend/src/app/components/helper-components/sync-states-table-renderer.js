import React, {Component} from 'react';
import ApiCall from "../../services/api-call";

export default class SyncStateTableRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {syncStates: this.parseSyncStates(props.value), onProgress: false}
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({syncStates: this.parseSyncStates(nextProps.value), onProgress: false})
  }

  render() {
    return (
        <React.Fragment>
          {this.state.syncStates.map(this.getSyncStateStatus.bind(this))}
        </React.Fragment>
    )
  }

  getSyncStateStatus(item, index) {
    if (item.status) {
      return <div className={this.getDotClass(item.status)}
                  key={index}
                  title={this.getItemTitle(item)}
                  onClick={() => this.handleStatusDotClick(item)}>&nbsp;</div>
    }

    return false;
  }

  getDotClass(status) {
    let result = 'status-dot';
    if (this.state.onProgress) {
      result += ' yellow blink';
    } else {
      result += status === 'COMPLETED' ? ' green' : ' red';
    }

    return result;
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
        toCatalog: splittedItem[4],
        syncStateId: splittedItem[5]
      });
    });

    return result;
  }

  handleStatusDotClick({syncStateId, status}) {
    if (status === 'COMPLETED') {
      return;
    }
    ApiCall.get('backend/synchronize', {entityName: 'sync_state', id: syncStateId}).then(() => {
      this.setState({onProgress: true});
    }, err => console.log(err))
  }

  handleSynchronizeButtonClick() {
    let entity = this.props.entity;
    this.setState({...this.state, isDataLoading: true});
    ApiCall.get('backend/synchronize', {entityName: entity.entityName, id: entity.itemId}).then(() => {
      this.props.openNotificationSnackbar('Entity successfully synchronized');
      this.setState({...this.state, isDataLoading: false, entitySyncStatus: 'COMPLETED'});
    }, this.handleRequestError.bind(this))
  }

  getItemTitle(item) {
    return `${item.fromCatalog}:${item.fromCatalogVersion} -> ${item.toCatalog}:${item.toCatalogVersion}`;
  }
}