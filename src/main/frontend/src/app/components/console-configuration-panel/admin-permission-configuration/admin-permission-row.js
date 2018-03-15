import React, {Component} from 'react';

import AdminPermissionCell from './admin-permission-cell'

export default class AdminPermissionRow extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <tr>
        <td>{this.props.aclClass.code}</td>
        {this.props.aclMasks.map(mask => <AdminPermissionCell openNotificationSnackbar={this.props.openNotificationSnackbar} setLoadingStatus={this.props.setLoadingStatus} sidID={this.props.sidID} key={mask.code} aclClass={this.props.aclClass} mask={mask} />)}
      </tr>
    )
  }
}