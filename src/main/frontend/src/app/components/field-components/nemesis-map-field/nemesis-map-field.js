import React  from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import NemesisMapFieldPopup from './nemesis-map-field-popup';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';
import Select from 'react-select';
import _ from 'lodash';

import SelectCustomArrow from '../../helper-components/select-custom-arrow';


export default class NemesisMapField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = {...this.state, selectedKey: this.getMapKeys()[0], openMapPopup: false};
  }

  render() {
    return (
      <div className="entity-field-container">
        <div style={{width: '300px', display: 'inline-block'}}>
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />{this.props.required ? <span className="required-star">*</span> : false}</div>
          <Select clearable={false}
                  arrowRenderer={() => <SelectCustomArrow />}
                  disabled={this.props.readOnly}
                  value={{value: this.state.selectedKey, label: this.state.selectedKey }}
                  onChange={(item) => this.handleChange(item)}
                  options={this.getMapKeys().map(item => {return {value: item, label: item}})}/>
        </div>
        <div className="entity-field-input-container" style={{verticalAlign: 'bottom'}}>
          <input type="text"
                 style={{height: '36px'}}
                 className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                 value={this.getInputValue()}
                 disabled={this.props.readOnly || !this.state.selectedKey}
                 onChange={(e) => this.onValueChange(e, e.target.value)} />
        </div>
        {this.props.type === nemesisFieldUsageTypes.edit ?
          (
            <i className="fa fa-table entity-navigation-icon" onClick={this.handleAllFieldsIconClick.bind(this)}/>
          ) : false
        }
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        <NemesisMapFieldPopup openPopup={this.state.openMapPopup} fields={this.state.value} onMapPopupClose={this.onMapPopupClose.bind(this)}/>
      </div>
    )
  }

  handleAllFieldsIconClick() {
    this.setState({...this.state, openMapPopup: true});
  }

  getMapKeys() {
    if (_.isEmpty(this.state.value)) {
      return [];
    }

    return Object.keys(this.state.value);
  }

  handleChange(item) {
    this.setState({...this.state, selectedKey: item.value});
  }

  getInputValue() {
    if (!this.state.value || !this.state.selectedKey) {
      return '';
    }

    return this.state.value[this.state.selectedKey];
  }

  onValueChange(ev, value) {
    let currentValue = {...this.state.value};
    currentValue[this.state.selectedKey] = value;
    super.onValueChange(ev, currentValue);
  }

  onMapPopupClose(shouldUpdateValue, newValue) {
    if (!shouldUpdateValue) {
      this.setState({...this.state, openMapPopup: false});
      return;
    }
    this.setState({...this.state, openMapPopup: false, isDirty: true, value: newValue}, () => {
      this.setState({...this.state, selectedKey: this.getMapKeys()[0]});
    });
  }
}