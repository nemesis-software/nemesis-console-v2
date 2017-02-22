import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Translate from 'react-translate-component';

export default class FilterRestrictionField extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedRestrictionField: null};
  }

  handleChange(event, index, value) {
    let restrictionField = this.props.restrictionFields[index];
    this.props.onRestrictionFieldChange(restrictionField);
    this.setState({selectedRestrictionField: restrictionField});
  }

  render() {
    return (
      <SelectField style={this.props.style} floatingLabelText={this.props.label ? `${this.props.label} restriction` : 'Restriction'}
        value={this.state.selectedRestrictionField}
        onChange={this.handleChange.bind(this)}>
        {this.props.restrictionFields.map((field, index) => <MenuItem key={index} value={field} primaryText={<Translate content={'main.' + field} fallback={field} />} />)}
      </SelectField>
    )
  }
}