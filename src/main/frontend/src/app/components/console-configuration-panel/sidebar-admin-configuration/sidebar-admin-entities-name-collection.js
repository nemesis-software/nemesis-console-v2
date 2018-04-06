import React from 'react';

import Select from 'react-select';

import Translate from 'react-translate-component';

import SelectCustomArrow from '../../helper-components/select-custom-arrow';

import NemesisBaseCollectionField from '../../field-components/nemesis-collection-field/nemesis-base-collection-field';

export default class SidebarAdminEntitiesNameCollection extends NemesisBaseCollectionField {
  constructor(props) {
    super(props);
  }

  getInputField() {
    return (
      <div className="entity-field-container" style={{marginTop: '20px'}}>
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label}/>{this.props.required ?
            <span className="required-star">*</span> : false}</div>
            <Select style={{width: '265px'}}
                    cache={false}
                    className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                    arrowRenderer={() => <SelectCustomArrow/>}
                    disabled={this.props.readOnly}
                    onChange={this.onItemSelect.bind(this)}
                    options={this.getOptions()}/>
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    );
  }

  getOptions() {
    return this.props.allEntitiesName.map((item, index) => {
      return {value: item, label: <Translate component="span" key={index} value={item} content={'main.' + item} fallback={item}/>}
    });
  }

  onItemSelect(item) {
      let itemValue = item.value;
      let valueActual = this.state.value || [];
      valueActual.push(itemValue);
      this.setState({...this.state, isDirty: true, value: valueActual});
  }
}