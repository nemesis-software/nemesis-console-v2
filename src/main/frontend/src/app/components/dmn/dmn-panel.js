import React, {Component} from 'react';
import DmnJS from 'dmn-js/lib/Modeler';
import '../../../styles/dmn-panel.less';
import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js-shared/assets/css/dmn-js-shared.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-decision-table-controls.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-font/css/dmn.css";
import {componentRequire} from "../../utils/require-util";
import NemesisEntityField from '../field-components/nemesis-entity-field/nemesis-entity-field';
import ApiCall from 'servicesDir/api-call';
import DataHelper from 'servicesDir/data-helper';
import NotificationSystem from 'react-notification-system';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

export default class DmnPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false, selectedDmnRule: null};
    this.notificationSystem = null;
    this.modeler = null;
  }

  render() {
    return (
       <div>
          <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
          {this.state.isLoading ? <div className="loading-screen"><i className="material-icons loading-icon">cached</i></div> : false}
          <div className="nemesis-dmn-panel">
            <div className="bpmnConfiguration">
                <NemesisEntityField entityId={'dmn_rule'} onValueChange={this.onDmnRuleSelect.bind(this)} value={this.state.selectedBpmn} label={'DMN Process'}/>
                <button className="nemesis-button success-button" onClick={() => this.editDmnRule()} disabled={!this.state
                .selectedDmnRule}>Load</button>
                <button className="nemesis-button success-button" onClick={() => this.saveDmnRule()} disabled={!this.state.selectedDmnRule}>Save</button>
            </div>
            <div>
                <div className="content with-diagram" id="js-drop-zone">
                  <div className="canvas" id="js-canvas"></div>
                </div>
            </div>
            <NotificationSystem ref="notificationSystem"/>
          </div>
      </div>
    );
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
    this.modeler = new DmnJS({
         container: '#js-canvas',
         keyboard: {
            bindTo: window
         }
   });
  }

  onDmnRuleSelect(value) {
    if (!value) {
      this.setState({selectedDmnRule: null});
      return;
    }
    this.setState({selectedDmnRule: value});
  }

  onDmnSelect() {
  }

  editDmnRule() {
      let valueToLoad = this.state.selectedDmnRule;
      if (!valueToLoad) {
        return;
      }
     var self = this;
     ApiCall.get(`dmn_rule/${valueToLoad.id}`).then(result => {
        this.modeler.importXML(result.data.value, function(err) {
               if (err) {
                 return console.error('could not import DMN 1.1 diagram', err);
               }
               var activeEditor = self.modeler.getActiveViewer();
               // access active editor components
               var canvas = activeEditor.get('canvas');
               // zoom to fit full viewport
               canvas.zoom('fit-viewport');
             });
     });

  }

  saveDmnRule() {
       if (!this.state.selectedDmnRule) {
         return;
       }
       var self = this;
       this.modeler.saveXML({ format: true }, function(err, xml) {
          if (!err) {
            ApiCall.patch(`dmn_rule/${self.state.selectedDmnRule.id}`, {value: xml}).then(
                 () => {
                   self.openNotificationSnackbar('Saved successfully!');
                 },
                 (err) => {
                   self.openNotificationSnackbar('Save failed!', 'error');
               });
          }
       });
  }

  openNotificationSnackbar(message, level) {
      this.notificationSystem.addNotification({
        message: message,
        level: level || 'success',
        position: 'tc'
      });
  }
}
