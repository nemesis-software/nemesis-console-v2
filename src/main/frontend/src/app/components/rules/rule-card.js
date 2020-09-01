import React, { Component } from 'react';
import '../../../styles/rules-panel.less';
import NemesisTextField from '../field-components/nemesis-text-field/nemesis-text-field';
import Select from 'react-select';
import uuidv4 from 'uuid/v4';
import Constraints from './constraints';
import '../../../styles/rules-panel.less';

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

export class RuleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descrs: this.props.rule.lhs.descrs.map(descrs => ({ ...descrs, id: uuidv4() }))
        };
    }

    addLhs = () => {
        this.setState(prevState => ({
            descrs: [{
                id: uuidv4(),
                objectType: '',
                identifier: '',
                constraint: [
                    { descrs: [] }
                ]
            },
            ...prevState.descrs
            ]
        }))
    };

    removeLhs = (descrId) => {
        this.setState({
            descrs: this.state.descrs.filter(descr => descr.id !== descrId)
        })
    };

    render() {
        const { rule, deleteRule } = this.props;

        return (
            <div className="rule">
                <span className="delete-icon-container" onClick={() => deleteRule(rule.id)}><i className="fa fa-times delete-icon"></i></span>
                <div><NemesisTextField value={rule.name} label={'Name'} /></div>
                <div className='salience-container'><NemesisTextField value={rule.salience} label={'Salience'} /></div>
                <br></br>
                <b>WHEN</b>
                <span className="plus-icon plus-lhs" onClick={this.addLhs}>
                    <i className="fas fa-plus" ></i>
                </span>
                <div className="lhs">
                    {this.state.descrs && this.state.descrs.map(descr => {
                        return (
                            <div key={descr.id} className='lhs-container'>
                                <span className="remove-icon" onClick={() => this.removeLhs(descr.id)}><i className="fas fa-remove"></i></span>
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
                                <Constraints
                                    constraint={descr.constraint}
                                    addNewAttr={this.addNewAttr}
                                    descrId={descr.id}
                                />
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
    }
}

export default RuleCard;
