import React, {Component} from 'react';
import {componentRequire} from "../../utils/require-util";
import NemesisEntityField from '../field-components/nemesis-entity-field/nemesis-entity-field';
import ApiCall from 'servicesDir/api-call';
import DataHelper from 'servicesDir/data-helper';
import NotificationSystem from 'react-notification-system';
import '../../../styles/rules-panel.less';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

export default class RulesPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false, selectedRule: null, selectedRuleSyntax: null};
    this.notificationSystem = null;
  }

  render() {
    return (
       <div>
          <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
          {this.state.isLoading ? <div className="loading-screen"><i className="material-icons loading-icon">cached</i></div> : false}
          <div className="nemesis-rules-panel">
            <div className="ruleConfiguration">
                <NemesisEntityField entityId={'rule'} onValueChange={this.onRuleSelect.bind(this)} value={this.state.selectedRule} label={'Rule'}/>
                <button className="nemesis-button success-button" onClick={() => this.editRule()} disabled={!this.state
                .selectedRule}>Load</button>
                <button className="nemesis-button success-button" onClick={() => this.saveRule()} disabled={!this.state.selectedRule}>Save</button>
                <button className="nemesis-button primary-button" onClick={() => this.createRuleProcess()}>Create new</button>
                <button className="nemesis-button primary-button" onClick={() => this.createRuleProcess()}>Package and deploy</button>
            </div>
            <div>
                {this.state.isLoading ? (
                  <div className="loading-screen">
                    <i className="material-icons loading-icon">cached</i>
                  </div>
                ) : (
                  false
                )}
                {this.state.selectedRuleSyntax ? (
                    <div>
                        <div>Package name: {this.state.selectedRuleSyntax.namespace}</div>
                        Imports:
                        <ul>
                            {this.state.selectedRuleSyntax.imports.map((imp, index) => {
                                return <li key={index}>{imp.target}</li>
                            })}
                        </ul>
                        Globals:
                        <ul>
                            {this.state.selectedRuleSyntax.globals.map((global, index) => {
                                return <li key={index}>{global.type} {global.identifier}</li>
                            })}
                        </ul>
                        <div className="rules">
                            {this.state.selectedRuleSyntax.rules.map((rule, index) => {
                                return (
                                    <div className="rule" key={index}>
                                        <div>Salience: {rule.salience}</div>
                                        <b>WHEN</b>
                                        <div className="lhs">
                                            {rule.lhs.descrs.map((descr, index) => {
                                                return (
                                                    <div key={index}>
                                                        Exists {descr.objectType} as {descr.identifier} with:
                                                        <ul>
                                                        </ul>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                  false
                )}
            </div>
            <NotificationSystem ref="notificationSystem"/>
          </div>
      </div>
    );
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  onRuleSelect(value) {
    if (!value) {
      this.setState({...this.state, selectedRule: null});
      return;
    }
    this.setState({...this.state, selectedRule: value});
  }

  editRule() {
      let valueToLoad = this.state.selectedRule;
      if (!valueToLoad) {
        return;
      }

     ApiCall.get(`/backend/rule/syntax/${valueToLoad.id}`).then(result => {
        console.log(result.data);
        this.setState({...this.state, selectedRuleSyntax: result.data});
     });

  }

  createRuleProcess() {

  }

  saveRule() {
       if (!this.state.selectedRule) {
         return;
       }
       var self = this;
       ApiCall.patch(`rule/${self.state.selectedRule.id}`, {content: ''}).then(
             () => {
               self.openNotificationSnackbar('Saved successfully!');
             },
             (err) => {
               self.openNotificationSnackbar('Save failed!', 'error');
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
