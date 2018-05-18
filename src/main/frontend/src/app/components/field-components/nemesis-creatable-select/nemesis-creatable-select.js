import React  from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'

import Select from 'react-select';

import SelectCustomArrow from '../../helper-components/select-custom-arrow';

export default class NemesisCreatableSelect extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />{this.props.required ? <span className="required-star">*</span> : false}</div>
          <Select.Creatable style={this.getSelectStyle()}
                  clearable={this.props.clearable === undefined ? true : this.props.clearable}
                  arrowRenderer={() => <SelectCustomArrow />}
                  className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                  disabled={this.props.readOnly}
                  value={this.state.value ? {value: this.state.value, label: <Translate content={'main.' + this.state.value} fallback={this.state.value} />} : null} //
                  onChange={(item) => this.onChange(item && item.value)}
                  options={this.props.values.map(this.getOptions.bind(this))}/>
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    )
  }

  getSelectStyle() {
    let style = {...this.props.style};
    if (this.state.errorMessage) {
      style.borderColor = '#F24F4B';
    }

    return style;
  }

  getOptions(value) {
    return {value: value, label: <Translate content={'main.' + value} fallback={value} />}
  }


  onChange(item) {
    this.onValueChange(null, item);
  }
}