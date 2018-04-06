import React, {Component} from 'react';

import ApiCall from 'servicesDir/api-call';
import DataHelper from 'servicesDir/data-helper';

import _ from 'lodash';

export default class AdminPermissionCell extends Component {
  constructor(props) {
    super(props);
    this.state = {aclEntry: this.parseAclEntry(props.aclClass.customClientData, props.mask.code)};
  }

  render() {
    return (
      <td>
        <input title={this.props.mask.code} type="checkbox" className={"nemesis-checkbox" + (this.state.aclEntry ? ' active' : '')} onChange={this.handleCheckboxChange.bind(this)}/>
      </td>
    )
  }

  parseAclEntry(aclEntries, maskCode) {
    let index = _.findIndex(aclEntries, {mask: maskCode});
    if (index === -1) {
      return null;
    }

    return aclEntries[index];
  }

  handleCheckboxChange() {
    if (this.state.aclEntry) {
      this.props.setLoadingStatus(true);
      ApiCall.delete(`acl_entry/${this.state.aclEntry.id}`).then(() => {
        this.props.openNotificationSnackbar('Permission successfully removed!');
        this.setState({aclEntry: null}, () => {
          this.props.setLoadingStatus(false);
        })
      });
    } else {
      this.props.setLoadingStatus(true);
      ApiCall.get(this.props.aclClass._links.aclObjectIdentities.href).then(result => {
        let objectIdentity = DataHelper.mapCollectionData(result.data)[0];
        if (!objectIdentity) {
          let newObjectIdentity = {
            inheriting: true,
            objectClass: this.props.aclClass.id,
            objectIdentity: -1,
            ownerSid: this.props.sidID
          };
          ApiCall.post('acl_object_identity', newObjectIdentity).then(result => {
            this.createAclClass(result.data.id);
          })
        } else {
          this.createAclClass(objectIdentity.id);
        }
      });
    }
  }

  createAclClass(objectIndentityId) {
    let actualEntry = {
      sid: this.props.sidID,
      order: 1,
      objectIdentity: objectIndentityId,
      mask: this.props.mask.id,
      auditFailure: false,
      auditSuccess: false,
      granting: true
    };
    ApiCall.post('acl_entry', actualEntry).then(result => {
      this.props.openNotificationSnackbar('Permission successfully saved!');
      this.setState({aclEntry: result.data});
      this.props.setLoadingStatus(false);
    })
  }
}