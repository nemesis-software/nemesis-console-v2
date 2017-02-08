import React from 'react';
import NemesisNumberField from '../nemesis-number-field'

export default class NemesisDecimalField extends NemesisNumberField {
  constructor(props) {
    super(props);
  }

  getStepSize() {
    return '0.1';
  }
}