import React, {Component} from 'react';

import {componentRequire} from '../../utils/require-util'

import AllFieldsConfiguration from './all-fields-configuration/all-fields-configuration';

import NotificationSystem from 'react-notification-system';


let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

const ConfigurationOptions = {
  MASTER_ADMIN: 'Master admin',
  QUICK_VIEW: 'Quick view',
  SEARCH_FIELDS: 'Search fields',
  RESULT_FIELDS: 'Result Fields'
};

export default class ConsoleConfigurationPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {configurationOption: null};
    this.notificationSystem = null;
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  render() {
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => {}}/>
        <div className="console-configuration-panel">
          Console Configuration Panel
          {this.state.configurationOption ? this.getConfigurationOptionPanel(this.state.configurationOption) :
            <div>
              <div className="configuration-type-box" onClick={() => {this.setSelectedConfiguration(ConfigurationOptions.MASTER_ADMIN)}} >Configuration for master admin</div>
              <div className="configuration-type-box" onClick={() => {this.setSelectedConfiguration(ConfigurationOptions.QUICK_VIEW)}}>Configuration for quick view</div>
              <div className="configuration-type-box" onClick={() => {this.setSelectedConfiguration(ConfigurationOptions.SEARCH_FIELDS)}}>Configuration for search fields</div>
              <div className="configuration-type-box" onClick={() => {this.setSelectedConfiguration(ConfigurationOptions.RESULT_FIELDS)}}>Configuration for result fields</div>
            </div>}

        </div>
        <NotificationSystem ref="notificationSystem"/>
      </div>
    )
  }

  setSelectedConfiguration(configurationOption) {
    this.setState({configurationOption : configurationOption});
  }

  getConfigurationOptionPanel(configurationOption) {
    switch (configurationOption) {
      case ConfigurationOptions.MASTER_ADMIN: return <AllFieldsConfiguration openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}/>;
      case ConfigurationOptions.QUICK_VIEW: return <AllFieldsConfiguration/>;
      case ConfigurationOptions.SEARCH_FIELDS: return <div>Conf search</div>;
      case ConfigurationOptions.RESULT_FIELDS: return <div>Conf result</div>;
    }
  }

  openNotificationSnackbar(message, level) {
    this.notificationSystem.addNotification({
      message: message,
      level: level || 'success',
      position: 'tc'
    });
  }
}