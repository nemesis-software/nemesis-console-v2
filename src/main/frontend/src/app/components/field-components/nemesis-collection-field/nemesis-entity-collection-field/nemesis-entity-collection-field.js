import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import NemesisBaseCollectionField from '../nemesis-base-collection-field';
import {nemesisFieldUsageTypes} from '../../../../types/nemesis-types';
import ApiCall from '../../../../services/api-call';
import _ from 'lodash';
import Translate from 'react-translate-component';
import EmbeddedCreation from '../../../embedded-creation/embedded-creation';

import SelectCustomArrow from '../../../helper-components/select-custom-arrow';
import PropTypes from "prop-types";

export default class NemesisEntityCollectionField extends NemesisBaseCollectionField {
  constructor(props, context) {
    super(props, context);
    this.state = {...this.state, openEmbeddedCreation: false};

  }

  getInputField() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label}/>{this.props.required ?
            <span className="required-star">*</span> : false}</div>

          {this.props.entityId === 'catalog_version' && this.context.globalFiltersCatalogs && this.context.globalFiltersCatalogs.length > 0 ?

            <Select style={this.getSelectStyle()}
                    cache={false}
                    arrowRenderer={() => <SelectCustomArrow/>}
                    className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                    disabled={this.props.readOnly}
                    value={this.state.value ? {value: this.state.value, label: this.getItemText(this.state.value)} : this.state.value}
                    onChange={(item) => this.onValueChange(item && item.value)}
                    options={this.context.globalFiltersCatalogs.map(this.mapDataSource.bind(this))}/>
            :
            <AsyncSelect style={this.getSelectStyle()}
                          cache={false}
                          className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                          arrowRenderer={() => <SelectCustomArrow/>}
                          disabled={this.props.readOnly}
                          onChange={this.onItemSelect.bind(this)}
                          defaultOptions
                          loadOptions={this.filterEntityData.bind(this)}
            />
          }
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>
        {this.getAdditionalIconFunctionality()}
      </div>
    )
  }

  getAdditionalIconFunctionality() {

    if (!this.props.readOnly && ((this.props.type === nemesisFieldUsageTypes.edit) || (this.props.type === nemesisFieldUsageTypes.quickView && this.props.embeddedCreationAllowed))) {

      return (
        <React.Fragment>
          <i className={'material-icons entity-navigation-icon'} onClick={this.openEmbeddedCreation.bind(this)}>add</i>
          {this.state.openEmbeddedCreation ?
            <EmbeddedCreation onCreationCancel={() => this.setState({openEmbeddedCreation: false})} onCreateEntity={this.onCreateEmbeddedEntity.bind(this)}
                              entityId={this.props.entityId} type={this.props.type}/> : false}
        </React.Fragment>
      )
    }

    return false;
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
    let params = {page: 0, size: 20, code: `%${inputTextActual}%`, projection: 'search'};
    if (this.context.entityMarkupData[this.props.entityId] && this.context.entityMarkupData[this.props.entityId].synchronizable && this.context.globalFiltersCatalogs && this.context.globalFiltersCatalogs.length > 0) {
      params.catalogVersionIds = this.context.globalFiltersCatalogs.map(item => item.id).join(',');
    }
    return ApiCall.get(this.getSearchUrl(), params).then(result => {

      let data = [];
      _.forIn(result.data._embedded, (value) => data = data.concat(value));

      return  data.map((option) => this.mapDataSource(option));

    });
  }

  onItemSelect(item) {
    let valueActual = this.state.value || [];
    valueActual.push(item.value);
    this.setState({...this.state, isDirty: true, value: valueActual});
  }

  getSearchUrl() {
    let urlSuffix = '/search/findByCodeLike/';
    if (this.context.entityMarkupData[this.props.entityId] && this.context.entityMarkupData[this.props.entityId].synchronizable && this.context.globalFiltersCatalogs && this.context.globalFiltersCatalogs.length > 0) {
      urlSuffix = '/search/findByCodeLikeAndCatalogVersionIdIn'
    }

    return `${this.props.entityId}${urlSuffix}`;
  }

  mapDataSource(item) {
    return {
      value: item,
      label: this.getAutocompleteRenderingValue(item)
    }
  }

  getAutocompleteRenderingValue(item) {
    if (this.props.mainEntity.data.synchronizable) {
      return `${item.code}:${item.catalogVersion}`;
    }
    if (this.props.entityId === 'catalog_version') {
      return item.catalogVersion || item.code;
    }

    if (item.entityName === 'cms_slot') {
      return `${item.code}:${item.position}`
    }

    return item.code;
  }

  getFormattedValue() {
    if (!this.state.value) {
      return [];
    }

    return this.state.value.map(item => item.id);
  }

  getItemRenderingValue(item) {
    let visualizationContent = item.code;
    if (item.entityName === 'cms_slot') {
      visualizationContent = `${item.code}:${item.position}`;
    }

    return (
      <div className="chip-item">
        <span style={{verticalAlign: 'top'}}>{visualizationContent}</span>
        {this.props.type !== nemesisFieldUsageTypes.quickView ? <i style={{verticalAlign: 'top'}} className="material-icons"
           onClick={() => this.props.onEntityItemClick(item, this.props.entityId, item._links.self.href)}>launch</i> : false}
      </div>
    )
  }

  openEmbeddedCreation() {

    this.setState({openEmbeddedCreation: true});
  }

  onCreateEmbeddedEntity(entity) {
    this.setState({openEmbeddedCreation: false}, () => {
      this.onItemSelect({value:entity});
    })
  }
}

NemesisEntityCollectionField.contextTypes = {
  entityMarkupData: PropTypes.object,
  globalFiltersCatalogs: PropTypes.array
};
