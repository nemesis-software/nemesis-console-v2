import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'
import moment from 'moment';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';
import ReactDatetime from 'react-datetime';

export default class NemesisDateTimeField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />{this.props.required ? <span className="required-star">*</span> : false}</div>
          <ReactDatetime timeFormat={this.isTimeEditable()}
                         style={this.props.style}
                         className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                         inputProps={{disabled: this.props.readOnly, className: 'entity-field form-control'}}
                         value={this.state.value}
                         onChange={(v) => {this.onValueChange(null, v)}}
          />
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    )
  }

  isTimeEditable() {
    return true;
  }

  getFormattedValue(value) {
    if (!value) {
      return null;
    }
    return moment(value).format(this.getDateFormat());
  }

  getDateFormat() {
    if (this.props.type === nemesisFieldUsageTypes.edit) {
      return 'DD-MM-Y HH:mm:ss'
    }

    return 'Y-MM-DD\\THH:mm:ss';
  }

  setFormattedValue(value) {
    if (!value) {
      return null;
    }

    return moment(value, this.getDateFormat()).toDate();
  }
}