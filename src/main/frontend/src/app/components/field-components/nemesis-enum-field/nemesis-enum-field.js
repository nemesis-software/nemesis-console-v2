import React  from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'

import Select from 'react-select';

import SelectCustomArrow from '../../helper-components/select-custom-arrow';

export default class NemesisEnumField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <label><Translate content={'main.' + this.props.label} fallback={this.props.label} /></label>
          <Select style={this.getSelectStyle()}
                  clearable={false}
                  arrowRenderer={() => <SelectCustomArrow />}
                  className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '')}
                  disabled={this.props.readOnly}
                  value={this.state.value !== -1 ? {value: this.state.value, label: <Translate content={'main.' + this.props.values[this.state.value]} fallback={this.props.values[this.state.value]} />} : null} //
                  onChange={(item) => this.onChange(item)}
                  options={this.props.values.map(this.getOptions.bind(this))}/>
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    )
  }

  getSelectStyle() {
    let style = {width: '300px'};
    if (this.state.errorMessage) {
      style.borderColor = '#F24F4B';
    }

    return style;
  }

  getOptions(value, index) {
    return {value: index, label: <Translate content={'main.' + value} fallback={value} />}
  }

  getFormattedValue(value) {
    return this.props.values[value];
  }

  isEmptyValue() {
    return this.state.value < 0;
  }

  onChange(item) {
    this.onValueChange(event, item && item.value);
  }
}