import React, {Component} from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import '../../../styles/bpmn-panel.less';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import {componentRequire} from "../../utils/require-util";
import NemesisEntityField from '../field-components/nemesis-entity-field/nemesis-entity-field';
import ApiCall from 'servicesDir/api-call';
import DataHelper from 'servicesDir/data-helper';
import NotificationSystem from 'react-notification-system';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

const modeler;

export default class BpmnPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false, selectedBpmnProcess: null};
    this.notificationSystem = null;
  }

  render() {
    return (
       <div>
          <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
          {this.state.isLoading ? <div className="loading-screen"><i className="material-icons loading-icon">cached</i></div> : false}
          <div className="nemesis-bpmn-panel">
            <div className="bpmnConfiguration">
                <NemesisEntityField entityId={'bpmn_process'} onValueChange={this.onBpmnSelect.bind(this)} value={this.state.selectedBpmn} label={'BPMN Process'}/>
                <button className="nemesis-button success-button" onClick={() => this.editBpmnProcess()} disabled={!this.state.selectedBpmnProcess}>Edit</button>
                <button className="nemesis-button success-button" onClick={() => this.saveBpmnProcess()} disabled={!this.state.selectedBpmnProcess}>Save</button>
            </div>
            <div>
                <div className="content with-diagram" id="js-drop-zone">
                  <div className="canvas" id="js-canvas"></div>
                  <div id="properties" className="properties-panel-parent"></div>
                </div>
            </div>
            <NotificationSystem ref="notificationSystem"/>
          </div>
      </div>
    );
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
        modeler = new BpmnModeler({
          additionalModules: [
            propertiesPanelModule,
            propertiesProviderModule
          ],
          moddleExtensions: {
            camunda: camundaModdleDescriptor
          },
          container: '#js-canvas',
          propertiesPanel: {
            parent: '#properties'
          }
        });

        modeler.importXML(result.data.content, function(err) {
          if (err) {
            console.error(err);
          }
        });
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

       modeler.saveXML({ format: true }, function(err, xml) {

          if (!err) {
            console.log(xml);
            PlatformApiCall.post(`bpmn_process/${selectedBpmnProcess.id}`, {content: xml}).then(
                 () => {
                   this.props.openNotificationSnackbar('Saved successfully!');
                 },
                 (err) => {
                   this.props.openNotificationSnackbar('Save failed!', 'error');
               });
          }
       });
  }
}
