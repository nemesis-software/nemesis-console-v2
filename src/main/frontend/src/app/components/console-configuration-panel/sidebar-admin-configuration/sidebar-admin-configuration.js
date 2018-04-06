import React, {Component} from 'react';

import ApiCall from 'servicesDir/api-call';
import DataHelper from 'servicesDir/data-helper';

import _ from 'lodash';

import SidebarAdminItemPanel from './sidebar-admin-item-panel';

export default class SidebarAdminConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {sidebars: [], allEntitiesName: []};
    this.fieldPanelReferences = [];
  }


  componentWillMount() {
    this.fieldPanelReferences = [];
  }

  componentWillUpdate() {
    this.fieldPanelReferences = [];
  }

  componentWillMount() {
    return Promise.all([ApiCall.get('sidebar_section'), ApiCall.get('markup/entity/fields')]).then(result => {
      this.setState({sidebars: DataHelper.mapCollectionData(result[0].data), allEntitiesName: _.keys(result[1].data)});
    });
  }

  render() {
    return (
      <div className="sidebar-admin-configuration">
        <div className="sidebar-admin-configuration-header">
          <button className="nemesis-button success-button save-button" onClick={this.onSaveButtonClick.bind(this)}>Save</button>
          <button className="nemesis-button" onClick={this.addNewField.bind(this)}>Add new field</button>
        </div>
        <div>
          {this.state.sidebars.map((item, index) => <SidebarAdminItemPanel ref={(fieldPanel) => {fieldPanel && this.fieldPanelReferences.push(fieldPanel)}}
                                                                              onDeleteField={this.onDeleteField.bind(this)}
                                                                              openNotificationSnackbar={this.props.openNotificationSnackbar}
                                                                              itemIndex={index}
                                                                              item={item}
                                                                              key={index}
                                                                              allEntitiesName={this.state.allEntitiesName}/>)}
        </div>
      </div>
    )
  }

  onDeleteField(index) {
    let sidebars = this.state.sidebars;
    sidebars.splice(index, 1);
    this.setState({sidebars: sidebars}, () => {
      this.props.openNotificationSnackbar(`Section successfully removed`)
    });
  }

  onSaveButtonClick() {
    _.forEach(this.fieldPanelReferences, fieldPanel => {
      fieldPanel.onSaveButtonClick();
    })
  }

  addNewField() {
    let sidebars = this.state.sidebars;
    sidebars.unshift({});
    this.setState({sidebars: sidebars});
  }
}