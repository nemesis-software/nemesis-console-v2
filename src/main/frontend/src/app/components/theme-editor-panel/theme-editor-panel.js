import React, {Component} from 'react';
import {componentRequire} from "../../utils/require-util";
import NemesisEntityField from '../field-components/nemesis-entity-field/nemesis-entity-field';
import NemesisColorpickerField from '../field-components/nemesis-colorpicker-field/nemesis-colorpicker-field';
import NemesisTextField from '../field-components/nemesis-text-field/nemesis-text-field';
import ApiCall from 'servicesDir/api-call';
import DataHelper from 'servicesDir/data-helper';
import NotificationSystem from 'react-notification-system';
import Translate from 'react-translate-component';
import CodeMirror from 'react-codemirror';
import '../../../styles/theme-panel.less';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

export default class ThemeEditorPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false, selectedTheme: null, selectedThemeParentTheme: null, selectedThemeId: null};
    this.notificationSystem = null;
    this.modeler = null;
  }

  render() {
    return (
       <div>
          <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
          {this.state.isLoading ? <div className="loading-screen"><i className="material-icons loading-icon">cached</i></div> : false}
          <div className="nemesis-theme-panel">
              <div className="themeConfiguration">
                  <NemesisEntityField entityId={'site_theme'} onValueChange={this.onThemeSelect.bind(this)} label={'Theme'}/>
                  <button className="nemesis-button success-button" onClick={() => this.editTheme()} disabled={!this.state
                  .selectedThemeId}>Load</button>
                  <button className="nemesis-button success-button" onClick={() => this.saveTheme()} disabled={!this.state.selectedThemeId}>Save</button>
                  <button className="nemesis-button primary-button" onClick={() => this.createTheme()}>Create new</button>
              </div>
              <div>
                  {this.state.selectedTheme ? <div className="content" key={this.state.selectedTheme.id}>
                      <div className="left-column">
                         <ul>
                             <li>
                                <NemesisEntityField entityId={'site_theme'} value={this.state.selectedThemeParentTheme} label={'Parent Theme'}/>
                                <NemesisTextField value={this.state.selectedTheme.fontName} label="Font Name"/>
                             </li>
                             <li>
                                 <NemesisColorpickerField value={this.state.selectedTheme.primaryColor} label="Primary Color"/>
                                 <NemesisColorpickerField value={this.state.selectedTheme.secondaryColor} label="Secondary Color"/>
                             </li>
                             <li>
                                 <NemesisColorpickerField value={this.state.selectedTheme.successColor} label="Success Color"/>
                                 <NemesisColorpickerField value={this.state.selectedTheme.dangerColor} label="Danger Color"/>
                             </li>
                             <li>
                                 <NemesisColorpickerField value={this.state.selectedTheme.warningColor} label="Warning Color"/>
                                 <NemesisColorpickerField value={this.state.selectedTheme.infoColor} label="Info Color"/>
                             </li>
                             <li>
                                 <NemesisColorpickerField value={this.state.selectedTheme.lightColor} label="Light Color"/>
                                 <NemesisColorpickerField value={this.state.selectedTheme.darkColor} label="Dark Color"/>
                             </li>
                             <li>
                                 <NemesisColorpickerField value={this.state.selectedTheme.mutedColor} label="Muted Color"/>
                                 <NemesisColorpickerField value={this.state.selectedTheme.whiteColor} label="White Color"/>
                             </li>
                         </ul>
                      </div>
                      <div className="right-column">
                        <Translate component="label" content={'main.style'} fallback='Style' />
                        <CodeMirror onChange={code => this.onValueChange(null, code)} value={this.state.value}  options={{lineNumbers: true, mode:
                        'text/css'}}/>
                      </div>
                  </div> : false}
              </div>
              <NotificationSystem ref="notificationSystem"/>
          </div>
      </div>
    );
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  onThemeSelect(value) {
      if (!value) {
        this.setState({selectedThemeId: null});
        return;
      }
      this.setState({selectedThemeId: value.id});
  }

  openNotificationSnackbar(message, level) {
      this.notificationSystem.addNotification({
        message: message,
        level: level || 'success',
        position: 'tc'
      });
  }

  editTheme() {
        let valueToLoad = this.state.selectedThemeId;
        if (!valueToLoad) {
          return;
        }
       var self = this;
       ApiCall.get(`site_theme/${valueToLoad}`).then(result => {
             this.setState({selectedTheme: result.data});
       });
  }

  saveTheme() {
     if (!this.state.selectedTheme) {
       return;
     }
     var self = this;
  }

  createTheme() {
    this.setState({ ...this.state, openBackendConsolePopup: true });
  }
}
