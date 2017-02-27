import React, { Component } from 'react';
import _ from 'lodash';

export default class NemesisBaseField extends Component {
  constructor(props) {
    super(props);

    this.state = {isDirty: false, value: this.setFormattedValue(this.props.value)};
  }

  render() {
    return (
      <div>Override in child!</div>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.value, nextProps.value)) {
      this.setState({...this.state, isDirty: false, value: this.setFormattedValue(nextProps.value)});
    }
  }

  onValueChange(event, value) {
    this.setState({...this.state, isDirty: true, value: value});
    if (this.props.onValueChange) {
      this.props.onValueChange(this.getFormattedValue(value));
    }
  }

  isFieldValid() {
    if (this.props.required) {
      return _.isEmpty(this.state.value);
    }

    return true;
  }

  getChangeValue() {
    if (this.state.isDirty) {
      return {name: this.props.name, value: this.getFormattedValue(this.state.value)};
    }

    return null;
  }

  getFormattedValue(value) {
    return value;
  }

  setFormattedValue(value) {
    return value;
  }
}

NemesisBaseField.propTypes = {
  label: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func,
  style: React.PropTypes.object,
  value: React.PropTypes.any,
  readOnly: React.PropTypes.bool,
  required: React.PropTypes.bool,
  name: React.PropTypes.string,
  type: React.PropTypes.string
};