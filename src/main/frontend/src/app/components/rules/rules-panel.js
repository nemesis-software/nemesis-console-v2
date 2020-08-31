import React, { Component } from 'react';
import { componentRequire } from "../../utils/require-util";
import NemesisEntityField from '../field-components/nemesis-entity-field/nemesis-entity-field';
import ApiCall from 'servicesDir/api-call';
import NotificationSystem from 'react-notification-system';
import '../../../styles/rules-panel.less';
import NemesisTextField from '../field-components/nemesis-text-field/nemesis-text-field';
import Select from 'react-select';
import RuleCard from './rule-card';
import Rules from './rules';
import uuidv4 from 'uuid/v4';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

const saliencePromotionOptions = [
  { label: 'Exists', value: 'Exists' },
  { label: 'Does not Exists', value: 'Does not Exists' },
  { label: 'There is', value: 'There is' },
  { label: 'There is not', value: 'There is not' },
];

const salienceFollowingOptions = [

  { label: 'the following', value: 'the following' },
  { label: 'all of the following', value: 'all of the following' },
  { label: 'any of the following', value: 'any of the following' }
];

export default class RulesPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedRule: null,
      selectedRuleSyntax: null,
      openBackendConsolePopup: false,
      showImports: false,
      test: null
    };
    this.notificationSystem = null;
  }
  render() {
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => { }} isOpenInFrame={this.isOpenInFrame} />
        {this.state.isLoading ? <div className="loading-screen"><i className="material-icons loading-icon">cached</i></div> : false}
        <div className="nemesis-rules-panel">
          <div className="ruleConfiguration left-spacing">
            <NemesisEntityField entityId={'brm_rule'} onValueChange={this.onRuleSelect} value={this.state.selectedRule} label={'Rule'} />
            <button className="nemesis-button success-button left-spacing" onClick={this.editRule} disabled={!this.state.selectedRule}>
              Load
            </button>
            <button className="nemesis-button success-button" onClick={this.saveRule} disabled={!this.state.selectedRule}>Save</button>
            <button className="nemesis-button primary-button" onClick={this.createRuleProcess}>Create new</button>
            <button className="nemesis-button primary-button" onClick={this.createRuleProcess}>Package and deploy</button>
          </div>
          <div>
            {this.state.isLoading && (
              <div className="loading-screen">
                <i className="material-icons loading-icon">cached</i>
              </div>
            )}
            {this.state.selectedRuleSyntax ? (
              <div>
                <div className="package-name-container left-spacing">
                  <NemesisTextField value={this.state.selectedRuleSyntax.namespace} label="Package name" />
                </div>
                <button className="nemesis-button success-button toogle-imports-button" onClick={this.showHideImports} >
                  {this.state.showImports ? 'Hide' : 'Show'} Imports
                </button>
                {this.state.showImports &&
                  <div className="left-spacing"><h4>Imports:</h4>
                    <ul>
                      {this.state.selectedRuleSyntax.imports.map((imp, index) => {
                        return <li key={index}>{imp.target}</li>
                      })}
                    </ul>
                  </div>
                }
                <div className="left-spacing">
                  <br></br>
                  <h4>Globals:</h4>
                  <ul>
                    {this.state.selectedRuleSyntax.globals.map((global, index) => {
                      return <li key={index}>{global.type} {global.identifier}</li>
                    })}
                  </ul>
                  <div className="rules">
                    <Rules rules={this.state.selectedRuleSyntax.rules} />
                    {/* {this.state.selectedRuleSyntax.rules.map((rule, index) => {
                      return (<div key={index}>
                        <RuleCard rule={rule} index={index} />
                      </div>
                      )
                    }
                    )} */}
                    {this.state.selectedRuleSyntax.rules.map((rule, index) => {
                      return (
                        <div className="rule" key={index}>
                          <div><NemesisTextField value={rule.name} label={'Name'} /></div>
                          <div className='salience-container'><NemesisTextField value={rule.salience} label={'Salience'} /></div>
                          <br></br>
                          <b>WHEN</b><i className="fas fa-plus"></i>
                          <div className="lhs">
                            {rule.lhs.descrs.map((descr, index) => {
                              return (
                                <div key={index} className='lhs-container' >
                                  <i className="fas fa-remove"></i>
                                  <Select
                                    className="entity-field-select entity-field globals-entity-field"
                                    value={saliencePromotionOptions[0]}
                                    options={saliencePromotionOptions}
                                  />
                                                        a
                                  <Select
                                    className="entity-field-select entity-field globals-entity-field"
                                    value={{ label: `${descr.objectType}`, value: `${descr.objectType}` }}
                                    options={[{ label: `${descr.objectType}`, value: `${descr.objectType}` }]}
                                  />
                                  ( <NemesisTextField value={descr.identifier} /> )
                                                        with
                                  <Select
                                    className="entity-field-select entity-field globals-entity-field"
                                    value={salienceFollowingOptions[0]}
                                    options={salienceFollowingOptions}
                                  />
                                                        attributes:
                                  <br />
                                  <ul style={{ paddingLeft: '50px', paddingTop: '10px' }}>
                                    {descr.constraint.descrs.map((constraintDescr, constraintIndex) => {
                                      let constraintDescrTextParts = constraintDescr.text.split(":");
                                      return (
                                        <li key={constraintIndex}><NemesisTextField value={constraintDescrTextParts[0]} /></li>
                                      )
                                    })}
                                  </ul>
                                </div>
                              )
                            })}
                          </div>
                          <b>THEN</b>
                          <div className="then-panel">
                            insert
                            <Select
                              className="entity-field-select entity-field globals-entity-field"
                              value={{ label: 'PromotionRuleResultDto', value: 'PromotionRuleResultDto' }}
                              options={[{ label: 'PromotionRuleResultDto', value: 'PromotionRuleResultDto' }]}
                            />

                                            with
                            <NemesisTextField value={'$promotion'} />
                            <NemesisTextField value={'POTENTIAL'} />
                            <NemesisTextField value={'changeDeliveryModePromotionRuleResultActionExecutor'} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
                false
              )}
          </div>
          <NotificationSystem ref="notificationSystem" />
        </div>
        {}
      </div>
    );
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  showHideImports = () => {
    this.setState({ showImports: !this.state.showImports });
  }

  onRuleSelect = (value) => {
    if (!value) {
      this.setState({ ...this.state, selectedRule: null });
      return;
    }
    this.setState({ ...this.state, selectedRule: value });
  }

  editRule = () => {
    let valueToLoad = this.state.selectedRule;
    if (!valueToLoad) {
      return;
    }
    ApiCall.get(`backend/rule/syntax/${valueToLoad.id}`).then(result => {
      this.setState({ ...this.state, selectedRuleSyntax: result.data, test: result.data }, () => console.log(this.state.test, 'test'));
    });

  }

  createRuleProcess = () => {
    this.setState({ ...this.state, openBackendConsolePopup: true });
  }

  saveRule = () => {
    if (!this.state.selectedRule) {
      return;
    }
    var self = this;
    ApiCall.patch(`rule/${self.state.selectedRule.id}`, { content: '' }).then(
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
