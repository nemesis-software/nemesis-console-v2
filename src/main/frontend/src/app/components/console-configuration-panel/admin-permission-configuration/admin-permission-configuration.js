import React, {Component} from 'react';

import ApiCall from 'servicesDir/api-call';
import DataHelper from 'servicesDir/data-helper';

import _ from 'lodash';

import NemesisEntityField from '../../field-components/nemesis-entity-field/nemesis-entity-field';

import AdminPermissionRow from './admin-permission-row'


export default class AdminPermissionConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {aclClasses: [], aclMasks: [], aclMappedClasses: [], selectedSID: null, isLoading: true};

  }

  componentWillMount() {
    return Promise.all([ApiCall.get('acl_class', {size: 10000}), ApiCall.get('acl_mask', {size: 10000})]).then(result => {
      let classes = DataHelper.mapCollectionData(result[0].data);
      let masks = _.orderBy(DataHelper.mapCollectionData(result[1].data), ['mask']);
      this.setState({aclClasses: classes, aclMasks: masks, isLoading: false});
    });
  }

  render() {
    return (
      <div className="admin-permission-configuration">
        {this.state.isLoading ? <div className="loading-screen">
          <i className="material-icons loading-icon">cached</i>
        </div> : false}
        <NemesisEntityField entityId={'principal'} onValueChange={this.onSidSelect.bind(this)} value={this.state.selectedSID} label={'SID'}/>
        {this.state.selectedSID ? <div className="entities-table-viewer" key={this.state.selectedSID.id}>
          <table>
            <thead>
            <tr>
              <th>Classes</th>
              {this.state.aclMasks.map(mask => <th key={mask.code}>{mask.code}</th>)}
            </tr>
            </thead>
            <tbody>
            {this.state.aclMappedClasses.map(aclClass => <AdminPermissionRow openNotificationSnackbar={this.props.openNotificationSnackbar}
                                                                             setLoadingStatus={this.setLoadingStatus.bind(this)}
                                                                             sidID={this.state.selectedSID.id}
                                                                             key={aclClass.code}
                                                                             aclClass={aclClass}
                                                                             aclMasks={this.state.aclMasks}/>)}
            </tbody>
          </table>
        </div> : false}
      </div>
    )
  }

  onSidSelect(value) {
    if (!value) {
      this.setState({aclMappedClasses: [], selectedSID: null});
      return;
    }
    this.setState({isLoading: true}, () => {
      this.getMappedClasses(value);
    });
  }

  setLoadingStatus(isLoading) {
    this.setState({isLoading: isLoading});
  }

  getMappedClasses(selectedSid) {
    let classes = [...this.state.aclClasses];
    Promise.all(classes.map(aclClass => ApiCall.get('acl_entry/search/findBySidCodeEqualsAndObjectIdentityObjectClassCodeEquals', {projection: 'search', sidCode: selectedSid.code, classCode: aclClass.code}))).then(result => {
      classes = classes.map((item, index) => {
        item.customClientData = DataHelper.mapCollectionData(result[index].data);
        return item;
      });
      this.setState({aclMappedClasses: classes, selectedSID: selectedSid, isLoading: false});
    });
  }
}