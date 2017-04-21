import React, { Component } from 'react';
import Translate from 'react-translate-component';

export default class FilterRestrictionField extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedRestrictionField: props.defaultValue || null};
  }

  handleChange(event) {
    let restrictionField = this.props.restrictionFields[event.target.selectedIndex];
    this.props.onRestrictionFieldChange(restrictionField);
    this.setState({selectedRestrictionField: restrictionField});
  }

  render() {
    return (
      <div style={this.props.style}>
        <label>{this.props.label ? `${this.props.label} restriction` : 'Restriction'}</label>
        <select defaultValue={this.props.defaultValue} className="form-control" onChange={this.handleChange.bind(this)} disabled={this.props.readOnly}>
          {this.props.restrictionFields.map((field, index) => <Translate component="option" key={index} value={field} content={'main.' + field} fallback={field} />)}
        </select>
      </div>
    )
  }
}