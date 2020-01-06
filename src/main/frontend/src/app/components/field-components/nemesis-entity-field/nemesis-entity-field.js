import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Translate from 'react-translate-component';
import ApiCall from '../../../services/api-call';
import _ from 'lodash';
import {nemesisFieldUsageTypes} from '../../../types/nemesis-types';
import {Modal} from 'react-bootstrap';
import NemesisBaseField from '../nemesis-base-field'
import EmbeddedCreation from '../../embedded-creation/embedded-creation';

import SelectCustomArrow from '../../helper-components/select-custom-arrow';
import PropTypes from "prop-types";

export default class NemesisEntityField extends NemesisBaseField {
  constructor(props, context) {
    super(props, context);
    this.state = {...this.state, openErrorDialog: false, errorMessage: null, openEmbeddedCreation: false};
  }

  render() {

    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label}/>{this.props.required ? <span className="required-star">*</span> : false}</div>
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
                          arrowRenderer={() => <SelectCustomArrow/>}
                          className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                          disabled={this.props.readOnly}
                          value={this.state.value ? {value: this.state.value, label: this.getItemText(this.state.value)} : this.state.value}
                          onChange={(item) => this.onValueChange(item && item.value)}
                          loadOptions={this.filterEntityData.bind(this)}/>
          }
        </div>
        {this.getAdditionalIcons()}
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        {this.getErrorDialog()}
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

  getAdditionalIcons() {
    if (this.props.type === nemesisFieldUsageTypes.edit && !!this.state.value) {
      return <i className={'material-icons entity-navigation-icon'} onClick={this.openEntityWindow.bind(this)}>launch</i>;
    }

    if ((this.props.type === nemesisFieldUsageTypes.edit && !this.state.value && !this.props.readOnly) || (this.props.type === nemesisFieldUsageTypes.quickView && this.props.embeddedCreationAllowed)) {
      return (
        <React.Fragment>
          <i className={'material-icons entity-navigation-icon'} onClick={this.openEmbeddedCreation.bind(this)}>add</i>
          {this.state.openEmbeddedCreation ?
            <EmbeddedCreation onCreationCancel={() => this.setState({openEmbeddedCreation: false})} onCreateEntity={this.onCreateEmbeddedEntity.bind(this)}
                              entityId={this.props.entityId} type={this.props.type}/> : false}
        </React.Fragment>
      )
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.value, nextProps.value)) {
      if (!nextProps.value) {
        return;
      }
      this.setState({...this.state, isDirty: false, value: this.setFormattedValue(nextProps.value)})
    }
  }

  onValueChange(value) {
    this.setState({...this.state, isDirty: true, value: value});
    if (this.props.onValueChange) {
      this.props.onValueChange(this.getFormattedValue(value));
    }
  }

  filterEntityData(inputText) {
    let inputTextActual = inputText || '';
    let params =  {
      page: 0,
      size: 10,
      catalogCode: `%${inputTextActual}%`,
      code: `%${inputTextActual}%`,
      projection: 'search'
    };

    if (this.context.entityMarkupData[this.props.entityId] && this.context.entityMarkupData[this.props.entityId].synchronizable && this.context
    .globalFiltersCatalogs && this.context.globalFiltersCatalogs.length > 0) {
      params.catalogVersionIds = this.context.globalFiltersCatalogs.map(item => item.id).join(',');
    }

    return ApiCall.get(this.getSearchUrl(),params).then(result => {
      let data = [];
      _.forIn(result.data._embedded, (value) => data = data.concat(value));
      return {options: data.map(...this.mapDataSource.bind(this))};
    }, this.handleRequestError.bind(this))
  }

  getSearchUrl() {
    let urlSuffix = '/search/findByCodeLike/';
    if (this.props.entityId === 'catalog_version') {
      urlSuffix = '/search/findByCodeLikeOrCatalogCodeLike/';
    }

    if (this.context.entityMarkupData[this.props.entityId] && this.context.entityMarkupData[this.props.entityId].synchronizable && this.context
    .globalFiltersCatalogs && this.context.globalFiltersCatalogs.length > 0) {
      urlSuffix = '/search/findByCodeLikeAndCatalogVersionIdIn'
    }

    return `${this.props.entityId}${urlSuffix}`;
  }

  mapDataSource(item) {
    return {
      value: item,
      label: this.getItemText(item)
    }
  }

  getItemText(item) {
    if (!item) {
      return '';
    }
    let text = item.code;
    if (this.props.entityId === 'catalog_version') {
      text = item.catalogVersion || item.code;
    } else if (this.props.entityId === 'cms_slot') {
      text = `${item.code} - ${item.position}`
    } else if (item.catalogVersion) {
      text = `${item.code} - ${item.catalogVersion}`
    }

    return text;
  }

  openEntityWindow() {
    if (this.state.value) {
      this.props.onEntityItemClick(this.state.value, this.props.entityId, this.state.value._links.self.href);
    }
  }

  handleRequestError(err) {
  }

  getErrorDialog() {
    return (
      <Modal show={this.state.openErrorDialog} onHide={this.handleCloseErrorDialog.bind(this)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{color: 'red'}}>{this.state.errorMessage}</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button success-button" onClick={this.handleCloseErrorDialog.bind(this)}>Ok</button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleCloseErrorDialog() {
    this.setState({...this.state, openErrorDialog: false});
  }

  getChangeValue() {
    if (this.state.isDirty) {
      return {name: this.props.name, value: this.state.value && this.state.value.id};
    }

    return null;
  }

  openEmbeddedCreation() {
    this.setState({openEmbeddedCreation: true});
  }

  onCreateEmbeddedEntity(entity) {
    this.setState({openEmbeddedCreation: false}, () => {
      this.onValueChange(entity);
    })
  }
}

NemesisEntityField.contextTypes = {
  entityMarkupData: PropTypes.object,
  globalFiltersCatalogs: PropTypes.array
};
