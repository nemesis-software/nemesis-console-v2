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
      <div className="entity-field-container" style={{display: 'inline-block', width:'256px'}}>
        <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
        <ReactDatetime timeFormat={this.isTimeEditable()}
                       style={this.props.style}
                       className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '')}
                       inputProps={{disabled: this.props.readOnly}}
                       value={this.state.value}
                       onChange={(v) => {this.onValueChange(null, v)}}
        />
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
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