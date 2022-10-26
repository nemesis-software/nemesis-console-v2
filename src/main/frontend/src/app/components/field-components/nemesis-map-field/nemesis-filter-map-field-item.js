import React, {Component} from 'react';
import NemesisBaseField from '../nemesis-base-field';

import _ from 'lodash';

export default class NemesisFilterMapFieldItem extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
          <div className="entity-field-input-container  half-size pr-2">
            <div><label>Key</label></div>
            <input type="text"
                   className="entity-field form-control"
                   disabled={this.props.readOnly}
                   value={this.getKeyValue()}
                   onChange={(e) => this.onEntryKeyChange(e, e.target.value)} />
          </div>
          <div className="entity-field-input-container  half-size pr-2">
            <div><label>Value</label></div>
            <input type="text"
                   className="entity-field form-control"
                   disabled={this.props.readOnly}
                   value={this.getValueValue()}
                   onChange={(e) => this.onEntryValueChange(e, e.target.value)} />
          </div>
      </div>
    )
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.item, nextProps.item)) {
      return;
    }
    this.setState({...this.state, key: nextProps.item.key, value: nextProps.item.value})
  }

  getKeyValue() {
    if (!this.state.value) {
      return '';
    };
    if (this.state.value.key === 'undefined' || this.state.value.key === null) {
      return '';
    } else {
      return this.state.value.key;
    };
  }

  getValueValue() {
    if (!this.state.value) {
      return '';
    }
    return this.state.value.value || '';
  }


  onEntryKeyChange(event, value) {
    let actualValue = {...this.state.value};
    if (!actualValue.key) {
      actualValue.key = '';
    }
    actualValue.key = value;

    if (actualValue.value === '' && actualValue.key === '') {
        actualValue = null;
    }

    this.onValueChange(event, actualValue);
  }

  onEntryValueChange(event, value) {
    let actualValue = {...this.state.value};
    if (!actualValue.value) {
      actualValue.amount = '';
    }
    actualValue.value = value;

    if (actualValue.value === '' && actualValue.key === '') {
        actualValue = null;
    }

    this.onValueChange(event, actualValue);
  }
}
