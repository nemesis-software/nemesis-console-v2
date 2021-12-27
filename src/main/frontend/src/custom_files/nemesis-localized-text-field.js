import React from 'react';
import NemesisLocalizedTextField from '../app/components/field-components/nemesis-localized-text-field/nemesis-localized-text-field';
import _ from 'lodash';

export default class CustomValidationLocalizedText extends NemesisLocalizedTextField {
  constructor(props, context) {
    super(props, context);
  }
  //Make custom validation for entity and field
  isFieldValid() {
    if (this.props.mainEntity.entityName === 'category' && this.props.name === 'name') {
       return this.customValidationForCategory();
    }
    return super.isFieldValid();
  }

  customValidationForCategory() {
    if (!this.state.value || (!this.state.value['en'] || _.isEmpty(this.state.value['en'].value)) || (!this.state.value['bg_BG'] || _.isEmpty(this.state.value['bg_BG'].value))) {
      this.setState({...this.state, errorMessage: this.getErrorMessage()});
      return false;
    }

    this.setState({...this.state, errorMessage: null});
    return true;
  }

  getErrorMessage() {
    return 'English and Bulgarian translation are required';
  }
}
