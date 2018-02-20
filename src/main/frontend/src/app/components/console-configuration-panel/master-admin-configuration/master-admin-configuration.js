import React, {Component} from 'react';

import _ from 'lodash';

import counterpart from 'counterpart';


import Translate from 'react-translate-component';

import ApiCall from 'servicesDir/api-call';

import MasterAdminFieldPanel from './master-admin-field-panel';

export default class MasterAdminConfiguration extends Component {
  constructor(props) {
    super(props);
    console.log(props.fieldData[0]);
    this.fieldPanelReferences = [];
  }

  componentWillMount() {
    this.fieldPanelReferences = [];
  }

  componentWillUpdate() {
    this.fieldPanelReferences = [];
  }

  render() {
    return (
      <div className="master-admin-configuration">
        <div><button className="nemesis-button success-button" onClick={this.onSaveButtonClick.bind(this)}>Save</button></div>
        {this.props.fieldData.map(field => {
          return <MasterAdminFieldPanel ref={(fieldPanel) => {fieldPanel && this.fieldPanelReferences.push(fieldPanel)}} key={field.name} field={field}/>
        })}
      </div>
    )
  }

  onSaveButtonClick() {
    _.forEach(this.fieldPanelReferences, fieldPanel => {
      fieldPanel.onSaveButtonClick();
    })
  }
}