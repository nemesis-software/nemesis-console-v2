import React  from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'

export default class NemesisEnumField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <label><Translate content={'main.' + this.props.label} fallback={this.props.label} /></label>
        <select defaultValue={this.getFormattedValue(this.state.value)} className="form-control" onChange={this.onChange.bind(this)} disabled={this.props.readOnly}>
          {this.props.values.map((value, index) =><Translate key={index} value={value} component="option" content={'main.' + value} fallback={value} />)}
        </select>
      </div>
    )
  }

  getFormattedValue(value) {
    return this.props.values[value];
  }

  isEmptyValue() {
    return this.state.value < 0;
  }

  onChange(event) {
    this.onValueChange(event, event.target.selectedIndex);
  }
}