import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class NemesisBaseField extends Component {
  constructor(props) {
    super(props);
    let value;
    if (this.constructor.name === 'NemesisCategoriesEntityCollectionField' && props.mainEntity.type === 'CREATE_ITEM') {
        if(this.props.defaultValue && (!this.props.value || this.props.value.length === 0)) {
            value = this.props.defaultValue;
        } else {
            value = this.props.value;
        }
    } else {
        value = this.props.value === undefined ? this.props.defaultValue : this.props.value;
    }

    this.state = { isDirty: (props.mainEntity && props.mainEntity.type === 'CREATE_ITEM' && this.props.defaultValue) ? true : false,
                    value: this.setFormattedValue(value)};
  }

  render() {
    return (
      <div>Override in child!</div>
    )
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.value, nextProps.value)) {
      this.setState({ ...this.state, isDirty: false, value: this.setFormattedValue(nextProps.value) });
    }
  }

  onValueChange(event, value) {
    this.setState({ ...this.state, isDirty: true, value: value });
    if (this.props.onValueChange) {
      this.props.onValueChange(this.getFormattedValue(value));
    }
    if (this.props.enableSaveButtons) {
      this.props.enableSaveButtons();
    };
  }

  isFieldValid() {
    if (this.props.required) {
      let isEmptyValue = this.isEmptyValue();
      if (isEmptyValue) {
        this.setState({ ...this.state, errorMessage: this.getErrorMessage() });
      } else {
        this.setState({ ...this.state, errorMessage: null });
      }

      return !isEmptyValue;
    }

    return true;
  }

  isEmptyValue() {
    return _.isEmpty(this.state.value);
  }

  getChangeValue() {
    if (this.state.isDirty) {
      return { name: this.props.name, value: this.getFormattedValue(this.state.value) };
    }

    return null;
  }

  getFormattedValue(value) {
    return value;
  }

  setFormattedValue(value) {
    return value;
  }

  resetDirtyState() {
    this.setState({ ...this.state, isDirty: false });
  }

  getErrorMessage() {
    return 'This field is required';
  }
}

NemesisBaseField.propTypes = {
  label: PropTypes.string,
  onValueChange: PropTypes.func,
  style: PropTypes.object,
  value: PropTypes.any,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string,
  type: PropTypes.string
};

NemesisBaseField.defaultProps = {
  enableSaveButtons: () => {}
}
