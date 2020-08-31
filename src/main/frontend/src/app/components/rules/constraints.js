import React, { Component } from 'react'
import NemesisTextField from '../field-components/nemesis-text-field/nemesis-text-field';
import uuidv4 from 'uuid/v4';

export class Constraints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descrs: props.constraint.descrs ? props.constraint.descrs.map(c => ({ ...c, id: uuidv4() })) : []
        }
    }

    addNewAttr = () => {
        this.setState({
            descrs: [...this.state.descrs, { id: uuidv4(), text: '' }]
        });
    };

    removeAttr = (descrId) => {
        this.setState({
            descrs: this.state.descrs.filter(x => x.id !== descrId)
        });
    };

    render() {
        return (
            <div>
                <ul className='constraints-list' style={{ paddingLeft: '50px', paddingTop: '10px' }}>
                    {this.state.descrs && this.state.descrs.map((constraintDescr, constraintIndex) => {
                        let constraintDescrTextParts = constraintDescr.text.split(":");
                        return (
                            <div key={constraintDescr.id}>
                                <li className='constraints-row'>
                                    <span className='remove-icon' onClick={() => this.removeAttr(constraintDescr.id)}><i className="fas fa-close"></i></span><NemesisTextField value={constraintDescrTextParts[0]} />
                                </li>
                            </div>
                        )
                    })}
                </ul>
             <span className="plus-icon" onClick={this.addNewAttr}><i className="fas fa-plus"></i>Add new attribute</span>
            </div>
        )
    }
}

export default Constraints
