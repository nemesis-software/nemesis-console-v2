import React, { Component } from 'react';
import Translate from 'react-translate-component';
import Select from 'react-select';

export default class FilterRestrictionField extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedRestrictionField: props.defaultValue || null};
  }

  handleChange(item) {
    let restrictionField = item && item.value;
    this.props.onRestrictionFieldChange(restrictionField);
    this.setState({selectedRestrictionField: restrictionField});
  }

  render() {
    return (
      <div style={{display: 'inline-block', width: '265px', ...this.props.style}}>
        <label>{this.props.label ? `${this.props.label} restriction` : 'Restriction'}</label>
        <Select style={{width: '100%'}}
                disabled={this.props.readOnly}
                value={{value: this.state.selectedRestrictionField, label: this.state.selectedRestrictionField }}
                onChange={(item) => this.handleChange(item)}
                options={this.getOptions()}/>
      </div>
    )
  }

  getOptions() {
    return this.props.restrictionFields.map((field, index) => {
      return {value: field, label: <Translate component="span" key={index} value={field} content={'main.' + field} fallback={field} />}
    });
  }
}