import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'

import Select from 'react-select';

import SelectCustomArrow from '../../helper-components/select-custom-arrow';

export default class NemesisEnumField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          {this.props.label && <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />{this.props.required ? <span className="required-star">*</span> : false}</div>}
          <Select style={this.getSelectStyle()}
            clearable={this.props.clearable === undefined ? true : this.props.clearable}
            arrowRenderer={() => <SelectCustomArrow />}
            className={'entity-field-select entity-field' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
            disabled={this.props.readOnly}
            value={this.state.value !== -1 ? { value: this.state.value, label: <Translate content={'main.' + this.props.values[this.state.value]} fallback={this.props.values[this.state.value]} /> } : null} //
            onChange={(item) => this.onChange(item)}
            options={this.props.values.map(this.getOptions.bind(this))} />
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    )
  }

  getSelectStyle() {
    let style = { ...this.props.style };
    if (this.state.errorMessage) {
      style.borderColor = '#F24F4B';
    }

    return style;
  }

  getOptions(value, index) {
    return { value: index, label: <Translate content={'main.' + value} fallback={value} /> }
  }

  getFormattedValue(value) {
    return this.props.values[value] ? this.props.values[value] : null;
  }

  isEmptyValue() {
    return this.state.value < 0;
  }

  onChange(item) {
    let newValue = !item ? -1 : item.value;
    if (this.props.enableSaveButtons) {
      this.props.enableSaveButtons();
    };
    this.onValueChange(newValue);
  }

  onValueChange = (value) => {
    this.setState((prevState) => ({ ...prevState, isDirty: true, value: value }));
    if (this.props.onValueChange && this.props.currentUnitId) {
      this.props.onValueChange(this.getFormattedValue(value), this.props.currentUnitId);
    } else if (this.props.onValueChange) {
      this.props.onValueChange(this.getFormattedValue(value));
    }
  }
}

NemesisEnumField.defaultProps = {
  enableSaveButtons: () => {}
}