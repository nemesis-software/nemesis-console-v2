import React from 'react';
import NemesisDateTimeField from './nemesis-date-time-field';

export default class NemesisDateField extends NemesisDateTimeField {
  constructor(props) {
    super(props);
  }

  isTimeEditable() {
    return false;
  }

  getDateFormat() {
    return 'Y-MM-DD'
  }
}