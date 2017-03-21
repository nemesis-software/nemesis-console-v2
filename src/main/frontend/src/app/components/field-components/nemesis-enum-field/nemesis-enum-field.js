import React, { Component } from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class NemesisEnumField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <SelectField style={this.props.style}
                     value={this.getFormattedValue(this.state.value) || ''}
                     disabled={this.props.readOnly}
                     errorText={this.state.errorMessage}
                     floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                     onChange={this.onValueChange.bind(this)}>
          {this.props.values.map((value, index) => <MenuItem key={index} value={value} primaryText={value} />)}
        </SelectField>
      </div>
    )
  }

  getFormattedValue(value) {
    return this.props.values[value];
  }
}