import React, { Component } from 'react'
import RuleCard from './rule-card';
import uuidv4 from 'uuid/v4';

export class Rules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rules: props.rules
        };
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        let nextState = {};

        if (nextProps.rules !== prevState.rules) {
            const rules = nextProps.rules

            nextState = {
                rules: rules
            };
        }

        return nextState;
    }

    addNewRule = () => {
        this.setState({
            rules: [{
                id: uuidv4(),
                name: '',
                salience: '',
                lhs: { descrs: [] }
            },
            ...this.state.rules
            ]
        })
    };

    deleteRule = (ruleId) => {
        this.setState({
            rules: this.state.rules.filter(x => x.id !== ruleId)
        })
    };

    render() {
        return (
            <div>
                <button className="nemesis-button success-button bottom-spacing" onClick={this.addNewRule}>Add new Rule</button>
                {this.state.rules.map((rule, index) => {
                    return (<div key={rule.id}>
                        <RuleCard
                            rule={rule}
                            deleteRule={this.deleteRule}
                        />
                    </div>
                    )
                }
                )}
            </div>
        )
    }
};

export default Rules;
