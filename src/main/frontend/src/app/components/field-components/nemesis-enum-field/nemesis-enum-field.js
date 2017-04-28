import React  from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'

import Select from 'react-select';

export default class NemesisEnumField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <label><Translate content={'main.' + this.props.label} fallback={this.props.label} /></label>
        <Select style={this.getSelectStyle()}
                clearable={false}
                disabled={this.props.readOnly}
                value={this.state.value !== -1 ? {value: this.state.value, label: <Translate content={'main.' + this.props.values[this.state.value]} fallback={this.props.values[this.state.value]} />} : null} //
                onChange={(item) => this.onChange(item)}
                options={this.props.values.map(this.getOptions.bind(this))}/>
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
      </div>
    )
  }

  getSelectStyle() {
    let style = {width: '256px'};
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