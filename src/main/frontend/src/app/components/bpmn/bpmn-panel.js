import React, {Component} from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import DmnJS from 'dmn-js/lib/Modeler';
import tokenSimulationModule from 'bpmn-js-token-simulation';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import '../../../styles/bpmn-panel.less';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import {componentRequire} from "../../utils/require-util";
import NemesisEntityField from '../field-components/nemesis-entity-field/nemesis-entity-field';
import ConsolePopup from "../../custom-components/backend-console-popup";
import ApiCall from 'servicesDir/api-call';
import DataHelper from 'servicesDir/data-helper';
import NotificationSystem from 'react-notification-system';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

export default class BpmnPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false, selectedBpmnProcess: null, openBackendConsolePopup: false};
    this.notificationSystem = null;
    this.modeler = null;
    this.dmnModeler = null;
  }

  render() {
    return (
       <div>
          <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
          {this.state.isLoading ? <div className="loading-screen"><i className="material-icons loading-icon">cached</i></div> : false}
          <div className="nemesis-bpmn-panel">
            <div className="bpmnConfiguration">
                <NemesisEntityField entityId={'bpmn_process'} onValueChange={this.onBpmnSelect.bind(this)} value={this.state.selectedBpmn} label={'BPMN Process'}/>
                <button className="nemesis-button success-button" onClick={() => this.editBpmnProcess()} disabled={!this.state
                .selectedBpmnProcess}>Load</button>
                <button className="nemesis-button success-button" onClick={() => this.saveBpmnProcess()} disabled={!this.state.selectedBpmnProcess}>Save</button>
                <button className="nemesis-button primary-button" onClick={() => this.createBpmnProcess()}>Create new</button>
                <button className="nemesis-button primary-button" onClick={() => this.deployBpmnProcess()}>Package and deploy</button>
            </div>
            <div>
                <div className="content with-diagram" id="js-drop-zone">
                  <div className="canvas" id="js-canvas"></div>
                  <div id="properties" className="properties-panel-parent"></div>
                </div>
            </div>
            <NotificationSystem ref="notificationSystem"/>
          </div>
          {this.state.openBackendConsolePopup ? (
            <ConsolePopup
              open={this.state.openBackendConsolePopup}
              entityId="bpmn_process"
              entityName="bpmn_process"
              onClose={() =>
                this.setState({ ...this.state, openBackendConsolePopup: false })
              }
            />
          ) : (
            false
          )}
      </div>
    );
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
    this.modeler = new BpmnModeler({
         additionalModules: [
           propertiesPanelModule,
           propertiesProviderModule,
           tokenSimulationModule
         ],
         keyboard: {
           bindTo: document
         },
         moddleExtensions: {
           camunda: camundaModdleDescriptor
         },
         container: '#js-canvas',
         propertiesPanel: {
           parent: '#properties'
         }
   });
   this.dmnModeler = new DmnJS({
        container: '#js-canvas',
        keyboard: {
           bindTo: window
        }
   });
  }

  onBpmnSelect(value) {
    if (!value) {
      this.setState({selectedBpmnProcess: null});
      return;
    }
    this.setState({selectedBpmnProcess: value});
  }

  editBpmnProcess() {
      let valueToLoad = this.state.selectedBpmnProcess;
      if (!valueToLoad) {
        return;
      }

     ApiCall.get(`bpmn_process/${valueToLoad.id}`).then(result => {
        this.modeler.importXML(result.data.content, function(err) {
          if (err) {
            console.error(err);
          }
        });
     });

  }

  createBpmnProcess() {
      this.setState({ ...this.state, openBackendConsolePopup: true });
  }

  deployBpmnProcess() {
       if (!this.state.selectedBpmnProcess) {
         return;
       }
       var self = this;


       ApiCall.post(`bpmn_process/${self.state.selectedBpmnProcess.id}/deploy`).then(
             () => {
               self.openNotificationSnackbar('Deployed successfully!');
             },
             (err) => {
               self.openNotificationSnackbar('Deploy failed!', 'error');
       });
  }

  setEncoded(link, name, data) {
      var encodedData = encodeURIComponent(data);

      if (data) {
        link.addClass('active').attr({
          'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
          'download': name
        });
      } else {
        link.removeClass('active');
      }
  }

  saveBpmnProcess() {
       if (!this.state.selectedBpmnProcess) {
         return;
       }
       var self = this;
       this.modeler.saveXML({ format: true }, function(err, xml) {
          if (!err) {
            ApiCall.patch(`bpmn_process/${self.state.selectedBpmnProcess.id}`, {content: xml}).then(
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
