import React from 'react';
import Select from 'react-select';
import NemesisBaseCollectionField from '../nemesis-base-collection-field';
import ApiCall from '../../../../services/api-call';
import _ from 'lodash';
import Translate from 'react-translate-component';

export default class NemesisEntityCollectionField extends NemesisBaseCollectionField {
  constructor(props) {
    super(props);
  }

  getInputField() {
    return (
      <div style={{width: '256px', display: 'inline-block'}} className="entity-field-container">
        <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label}/>
        <Select.Async style={this.getSelectStyle()}
                      cache={false}
                      disabled={this.props.readOnly}
                      onChange={this.onItemSelect.bind(this)}
                      loadOptions={this.filterEntityData.bind(this)}/>
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
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
    return ApiCall.get(this.getSearchUrl(), {page: 1, size: 10, code: `%${inputTextActual}%`, projection: 'search'}).then(result => {
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