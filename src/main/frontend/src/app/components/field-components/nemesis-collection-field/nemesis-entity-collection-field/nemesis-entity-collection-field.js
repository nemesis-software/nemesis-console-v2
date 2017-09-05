import React from 'react';
import Select from 'react-select';
import NemesisBaseCollectionField from '../nemesis-base-collection-field';
import ApiCall from '../../../../services/api-call';
import _ from 'lodash';
import Translate from 'react-translate-component';

import SelectCustomArrow from '../../../helper-components/select-custom-arrow';


export default class NemesisEntityCollectionField extends NemesisBaseCollectionField {
  constructor(props) {
    super(props);
  }

  getInputField() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label}/>{this.props.required ? <span className="required-star">*</span> : false}</div>
          <Select.Async style={this.getSelectStyle()}
                        cache={false}
                        className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                        arrowRenderer={() => <SelectCustomArrow />}
                        disabled={this.props.readOnly}
                        onChange={this.onItemSelect.bind(this)}
                        loadOptions={this.filterEntityData.bind(this)}/>
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
      </div>
    )
  }

  getSelectStyle() {
    let style = {width: '100%'};
    if (this.state.errorMessage) {
      style.borderColor = '#F24F4B';
    }

    return style;
  }

  filterEntityData(inputText) {
    let inputTextActual = inputText || '';
    return ApiCall.get(this.getSearchUrl(), {page: 0, size: 10, code: `%${inputTextActual}%`, projection: 'search'}).then(result => {
      let data = [];
      _.forIn(result.data._embedded, (value) => data = data.concat(value));
      return {options: data.map(this.mapDataSource.bind(this))};
    })
  }

  onItemSelect(item) {
    let valueActual = this.state.value || [];
    valueActual.push(item.value);
    this.setState({...this.state, isDirty: true, value: valueActual});
  }

  getSearchUrl() {
    let urlSuffix = '/search/findByCodeLike/';
    return `${this.props.entityId}${urlSuffix}`;
  }

  mapDataSource(item) {
    return {
      value: item,
      label: this.getAutocompleteRenderingValue(item)
    }
  }

  getAutocompleteRenderingValue(item) {
    if (item.entityName === 'cms_slot'){
      return `${item.code}:${item.position}`
    }

    return item.code;
  }

  getFormattedValue() {
    return this.state.value.map(item => item.id);
  }

  getItemRenderingValue(item) {
    let visualizationContent = item.code;
    if (item.entityName === 'cms_slot') {
      visualizationContent = `${item.code}:${item.position}`;
    }

    return (<div className="chip-item">
      <span style={{verticalAlign: 'top'}}>{visualizationContent}</span>
      <i style={{verticalAlign: 'top'}} className="material-icons" onClick={() =>  this.props.onEntityItemClick(item, this.props.entityId, item._links.self.href)}>launch</i>
    </div>)
  }
}