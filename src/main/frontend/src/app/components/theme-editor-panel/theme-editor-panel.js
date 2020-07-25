import React, { Component } from 'react';
import { componentRequire } from "../../utils/require-util";
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
    this.state = {
      isLoading: false,
      selectedTheme: null,
      selectedThemeParentTheme: null,
      selectedThemeId: null,
      parentTheme: null,
      createThemeMode: false,
      value: '',
      selectedParentTheme: null,
      newThemeName: ''
    };

    this.notificationSystem = null;
    this.modeler = null;
  }

  render() {
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => { }} isOpenInFrame={this.isOpenInFrame} />
        {this.state.isLoading ? <div className="loading-screen"><i className="material-icons loading-icon">cached</i></div> : false}
        <div className="nemesis-theme-panel">
          <div className="themeConfiguration">
            <NemesisEntityField entityId={'site_theme'} onValueChange={this.onThemeSelect} label={'Theme'} />
            <button className="nemesis-button success-button" onClick={this.editTheme} disabled={!this.state.selectedThemeId}>Load</button>
            <button className="nemesis-button success-button" onClick={this.saveTheme}>Save</button>
            <button className="nemesis-button primary-button" onClick={this.createTheme}>Create new</button>
          </div>
          <div>
            {this.state.selectedTheme ? <div className="content" key={this.state.selectedTheme.id}>
              <div className="left-column">
                <ul>
                  <li>
                    <NemesisTextField value={this.state.selectedTheme.code} onValueChange={this.onCodeChange} label="Code" />
                    <NemesisEntityField entityId={'site_theme'} onValueChange={this.onParentThemeSelect} value={this.state.parentTheme && this.state.parentTheme.content} label={'Parent Theme'} />
                  </li>
                  <li>
                    <NemesisTextField value={this.state.selectedTheme.fontName} onValueChange={this.onFontNameChange} label="Font Name" />
                    <NemesisTextField value={this.state.selectedTheme.spacer} onValueChange={this.onSpacerChange} label="Spacer" />
                  </li>
                  <li>
                    <NemesisColorpickerField value={this.state.selectedTheme.primaryColor} onValueChange={this.onPrimaryColorChange} label="Primary Color" />
                    <NemesisColorpickerField value={this.state.selectedTheme.secondaryColor} onValueChange={this.onSecondaryColorChange} label="Secondary Color" />
                  </li>
                  <li>
                    <NemesisColorpickerField value={this.state.selectedTheme.successColor} onValueChange={this.onSuccessColorChange} label="Success Color" />
                    <NemesisColorpickerField value={this.state.selectedTheme.dangerColor} onValueChange={this.onDangerColorChange} label="Danger Color" />
                  </li>
                  <li>
                    <NemesisColorpickerField value={this.state.selectedTheme.warningColor} onValueChange={this.onWarningColorChange} label="Warning Color" />
                    <NemesisColorpickerField value={this.state.selectedTheme.infoColor} onValueChange={this.onInfoColorChange} label="Info Color" />
                  </li>
                  <li>
                    <NemesisColorpickerField value={this.state.selectedTheme.lightColor} onValueChange={this.onLightColorChange} label="Light Color" />
                    <NemesisColorpickerField value={this.state.selectedTheme.darkColor} onValueChange={this.onDarkColorChange} label="Dark Color" />
                  </li>
                  <li>
                    <NemesisColorpickerField value={this.state.selectedTheme.mutedColor} onValueChange={this.onMutedColorChange} label="Muted Color" />
                    <NemesisColorpickerField value={this.state.selectedTheme.whiteColor} onValueChange={this.onWhiteColorChange} label="White Color" />
                  </li>
                </ul>
              </div>
              <div className="right-column">
                <Translate component="label" content={'main.style'} fallback='Style' />
                <CodeMirror onChange={this.updateStyle} value={this.state.selectedTheme.style} options={{
                  lineNumbers: true, mode:
                    'text/css'
                }} />
              </div>
            </div> : false}
          </div>
          <NotificationSystem ref="notificationSystem" />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  onThemeSelect = (value) => {
    if (!value) {
      this.setState({ selectedThemeId: null });
      return;
    }
    this.setState({ selectedThemeId: value.id });
  }

  onParentThemeSelect = (value) => {
    this.setState({
      selectedParentTheme: value
    })
  };

  onCodeChange = (value) => {
    this.changeSelectedThemeField('code', value);
  };

  onSpacerChange = (value) => {
    this.changeSelectedThemeField('spacer', value);
  };

  onFontNameChange = (value) => {
    this.changeSelectedThemeField('fontName', value);
  };

  onPrimaryColorChange = (value) => {
    this.changeSelectedThemeField('primaryColor', value);
  };

  onSecondaryColorChange = (value) => {
    this.changeSelectedThemeField('secondaryColor', value);
  };

  onSuccessColorChange = (value) => {
    this.changeSelectedThemeField('successColor', value);
  };

  onDangerColorChange = (value) => {
    this.changeSelectedThemeField('dangerColor', value);
  };

  onWarningColorChange = (value) => {
    this.changeSelectedThemeField('warningColor', value);
  };

  onInfoColorChange = (value) => {
    this.changeSelectedThemeField('infoColor', value);
  };

  onLightColorChange = (value) => {
    this.changeSelectedThemeField('lightColor', value);
  };

  onDarkColorChange = (value) => {
    this.changeSelectedThemeField('darkColor', value);
  };

  onMutedColorChange = (value) => {
    this.changeSelectedThemeField('mutedColor', value);
  };

  onWhiteColorChange = (value) => {
    this.changeSelectedThemeField('whiteColor', value);
  };

  updateStyle = (styleCode) => {
    this.changeSelectedThemeField('style', styleCode)
  };

  changeSelectedThemeField = (fieldName, value) => {
    this.setState(prevState => ({
      selectedTheme: {
        ...prevState.selectedTheme,
        [fieldName]: value
      }
    }))
  };

  openNotificationSnackbar(message, level) {
    this.notificationSystem.addNotification({
      message: message,
      level: level || 'success',
      position: 'tc'
    });
  };

  editTheme = () => {
    let valueToLoad = this.state.selectedThemeId;
    if (!valueToLoad) {
      return;
    }
    var self = this;
    ApiCall.get(`site_theme/${valueToLoad}`).then(result => {
      this.setState({
        selectedTheme: result.data,
        parentTheme: null,
        createThemeMode: false
      }, this.getParentTheme);
    });
  }

  getParentTheme = () => {
    let valueToLoad = this.state.selectedThemeId;

    ApiCall.get(`site_theme/${valueToLoad}/parentTheme`)
      .then(result => {
        this.setState({ parentTheme: result.data });
      })
      .catch(err => {
        console.log(err);
        this.setState({ parentTheme: null });
      });
  }

  saveTheme = () => {
    if (!this.state.selectedTheme) {
      return;
    }
    var self = this;

    const valueToLoad = this.state.selectedThemeId;
    const { selectedTheme, selectedParentTheme } = this.state

    const updateObject = {
      id: valueToLoad,
      code: selectedTheme.code,
      entityName: selectedTheme.entityName,
      parentTheme: selectedParentTheme && selectedParentTheme.id,
      dangerColor: selectedTheme.dangerColor,
      darkColor: selectedTheme.darkColor,
      infoColor: selectedTheme.infoColor,
      lightColor: selectedTheme.lightColor,
      mutedColor: selectedTheme.mutedColor,
      primaryColor: selectedTheme.primaryColor,
      secondaryColor: selectedTheme.secondaryColor,
      spacer: selectedTheme.spacer,
      style: selectedTheme.style,
      successColor: selectedTheme.successColor,
      warningColor: selectedTheme.warningColor,
      whiteColor: selectedTheme.whiteColor,
      new: selectedTheme.new,
    }
    Object.keys(updateObject).forEach((key) => (updateObject[key] == null) && delete updateObject[key]);

    if (this.state.createThemeMode) {
      ApiCall.post(`site_theme`, updateObject)
        .then(result => {
          this.openNotificationSnackbar('Theme Created Successfully!');
        })
    } else {
      ApiCall.patch(`site_theme/${valueToLoad}`, updateObject)
        .then(result => {
          this.openNotificationSnackbar('Theme Updated Successfully!');
          this.setState({
            createThemeMode: false
          })
        })
    }
  }

  openNotificationSnackbar = (message, level) => {
    this.notificationSystem.addNotification({
      message: message,
      level: level || 'success',
      position: 'tc'
    });
  }

  createTheme = () => {
    const emptyObj = {
      id: null,
      code: null,
      entityName: null,
      parentTheme: null,
      dangerColor: null,
      darkColor: null,
      infoColor: null,
      lightColor: null,
      mutedColor: null,
      primaryColor: null,
      secondaryColor: null,
      spacer: null,
      style: null,
      successColor: null,
      warningColor: null,
      whiteColor: null,
      new: null
    }

    this.setState({
      ...this.state,
      openBackendConsolePopup: true,
      createThemeMode: true,
      selectedTheme: emptyObj,
      selectedThemeParentTheme: null,
      selectedThemeId: null,
      parentTheme: null,
      value: '',
    });
  }
}