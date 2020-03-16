import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'
import {nemesisFieldUsageTypes} from '../../../types/nemesis-types';

export default class NemesisMoneyField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label}/>{this.props.required ? <span className="required-star">*</span> : false}</div>
        <div className="entity-field-input-container  half-size pr-2">
          <input type="number" step={this.props.step || '0.01'}
                 style={{...this.props.style}}
                 className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props
                 .readOnly
                  && this.isEmptyValue() ? ' empty-required-field' : '')}
                 value={this.getNumberValue()}
                 disabled={this.props.readOnly}
                 onChange={(e) => this.onAmountChange(e, e.target.value)}/>
        </div>
        <div className="entity-field-input-container half-size pl-2">
           <input type="text"
                 style={{...this.props.style}}
                 className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props
                 .readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                 value={this.getCurrencyValue()}
                 disabled={this.props.readOnly}
                 onChange={(e) => this.onCurrencyChange(e, e.target.value)}/>
        </div>
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
      </div>
    )
  }

  getNumberValue() {
    if (!this.state.value) {
      return '';
    }
    return this.state.value.amount || '';
  }

  getCurrencyValue() {
    if (!this.state.value) {
      return '';
    }
    return this.state.value.currency || '';
  }

//  getFormattedValue(value) {
//      debugger;
//      let languageActual = this.state.currency;
//      if (this.props.type !== nemesisFieldUsageTypes.edit) {
//        let result = {};
//        result.currency = languageActual;
//        result.value = value[languageActual] && value[languageActual].value;
//        return result;
//      }
//
//      return value;
//  }

  onCurrencyChange(event, value) {
    let actualValue = {...this.state.value};
    if (!actualValue.currency) {
      actualValue.currency = '';
    }
    actualValue.currency = value;
    this.onValueChange(event, actualValue);
  }

  onAmountChange(event, value) {
    let actualValue = {...this.state.value};
    if (!actualValue.amount) {
      actualValue.amount = '';
    }
    actualValue.amount = value;
    this.onValueChange(event, actualValue);
  }

  isEmptyValue() {
    if (this.state.value && this.state.value.amount && this.state.value.currency) {
      return false;
    }

    if (isFinite(this.state.value)) {
      return false;
    }

    return true;
  }
}
