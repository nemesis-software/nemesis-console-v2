import React from 'react';
import DatePicker from 'react-bootstrap-date-picker';
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
      <div className="entity-field-container" style={{display: 'inline-block', width:'256px'}}>
        <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
        <DatePicker style={this.props.style}
                    className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '')}
                    disabled={this.props.readOnly}
                    value={this.getValue()}
                    onChange={(v) => {this.onValueChange(null, v)}}
        />
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
      </div>
    )
  }

  getValue() {
    if (this.state.value) {
      return moment(this.state.value).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }

    return null;
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