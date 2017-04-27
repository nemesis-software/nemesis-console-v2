import React  from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';

const styles = {
  container: {
    display: 'inline-block',
    width: 'auto',
    marginRight: '10px'
  },
  label: {
    color: '#9e9e9e',
    fontSize: '16px',
    lineHeight: '24px',
    verticalAlign: 'top'
  }
};

export default class NemesisBooleanField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div><Translate  component="label" content={'main.' + this.props.label} fallback={this.props.label} /></div>
        <div style={{padding: '0 5px'}}>
          <label  className="radio-inline">
            <input className="nemesis-radio-button" type="radio" value="true" defaultChecked={'true' === this.state.value} onChange={this.handleRadioChange.bind(this)} disabled={this.props.readOnly} name={this.props.label}/>
            True
          </label>
          <label className="radio-inline">
            <input className="nemesis-radio-button" type="radio" value="false" defaultChecked={'false' === this.state.value} onChange={this.handleRadioChange.bind(this)} disabled={this.props.readOnly} name={this.props.label}/>
            False
          </label>
          <label style={this.getNotAvailableButtonStyle()} className="radio-inline">
            <input className="nemesis-radio-button" type="radio" defaultChecked={'null' === this.state.value} onChange={this.handleRadioChange.bind(this)} disabled={this.props.readOnly} value="null" name={this.props.label}/>
            N/A
          </label>
        </div>
      </div>
    )
  }

  handleRadioChange(e) {
    this.onValueChange(e, e.target.value);
  }

  setFormattedValue(value) {
    if (value === undefined) {
      return;
    }

    return value + '';
  }

  getFormattedValue(value) {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return null;
  }

  getNotAvailableButtonStyle() {
    let style = {...styles.container};
    if (this.props.type !== nemesisFieldUsageTypes.edit) {
      style.display = 'none';
    }

    return style;
  }
}