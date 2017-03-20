import React, { Component } from 'react';
import DatePicker from 'material-ui/DatePicker';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'
import moment from 'moment';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';

export default class NemesisDateField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <DatePicker style={this.props.style}
                    value={this.state.value}
                    disabled={this.props.readOnly}
                    floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                    onChange={this.onValueChange.bind(this)}/>
      </div>
    )
  }

  getFormattedValue(value) {
    return moment(value).set({hour:0,minute:0,second:0,millisecond:0}).format(this.getDateFormat());
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