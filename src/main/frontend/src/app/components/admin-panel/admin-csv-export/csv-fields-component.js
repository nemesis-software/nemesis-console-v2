import React from 'react';
import NemesisSimpleCollectionField from '../../field-components/nemesis-collection-field/nemesis-simple-collection-field/nemesis-simple-collection-field';

export default class CsvFieldsComponent extends NemesisSimpleCollectionField {
  constructor(props) {
    super(props);
  }

  onInputKeyPress(e) {
    if (e.key === 'Enter') {
      let valueActual = this.state.value || [];
      let inputValue = e.target.value;
      if (inputValue.indexOf(',') > -1) {
        valueActual = valueActual.concat(inputValue.split(','));
      } else {
        valueActual.push(inputValue);
      }

      e.target.value = null;
      this.setState({...this.state, isDirty: true, value: valueActual});
    }
  }
}