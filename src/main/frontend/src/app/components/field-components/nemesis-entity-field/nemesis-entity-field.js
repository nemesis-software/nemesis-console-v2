import React from 'react';
import Select from 'react-select';
import Translate from 'react-translate-component';
import ApiCall from '../../../services/api-call';
import _ from 'lodash';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';
import Modal from 'react-bootstrap/lib/Modal';
import NemesisBaseField from '../nemesis-base-field'
import 'react-select/dist/react-select.css';

export default class NemesisEntityField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = {...this.state, openErrorDialog: false, errorMessage: null };
  }

  render() {
    return (
    <div className="entity-field-container">
      <div style={{width: '256px', display: 'inline-block'}}>
        <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label}/>
        <Select.Async style={{width: '100%'}}
                      cache={false}
                      disabled={this.props.readOnly}
                      value={this.state.value ? {value: this.state.value, label: this.getItemText(this.state.value)} : this.state.value}
                      onChange={(item) => this.onValueChange(item && item.value)}
                      loadOptions={this.filterEntityData.bind(this)}/>
      </div>
      {this.props.type === nemesisFieldUsageTypes.edit ? <i className="material-icons entity-navigation-icon" onClick={this.openEntityWindow.bind(this)}>launch</i> : false}
      {this.getErrorDialog()}
    </div>
    )
  }

  componentWillReceiveProps(nextProps) {
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
    return ApiCall.get(this.getSearchUrl(), {page: 1, size: 10, catalogCode: inputTextActual, code: inputTextActual, projection: 'search'}).then(result => {
      let data = [];
      _.forIn(result.data._embedded, (value) => data = data.concat(value));
      return  {options: data.map(this.mapDataSource.bind(this))};
    }, this.handleRequestError.bind(this))
  }

  getSearchUrl() {
    let urlSuffix = '/search/findByCodeIsStartingWithIgnoreCase/';
    if (this.props.entityId === 'catalog_version') {
      urlSuffix = '/search/findByCodeIsStartingWithIgnoreCaseOrCatalogCodeIsStartingWithIgnoreCase/';
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
    } else if (this.props.entityId === 'cms_slot'){
      text = `${item.code} - ${item.position}`
    } else if (item.catalogVersion){
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
    let errorMsg = (err && err.response && err.response.data && err.response.data.message) || err.message || err;
    this.setState({...this.state, errorMessage: errorMsg, openErrorDialog: true})
  }

  getErrorDialog() {
    return (
      <Modal show={this.state.openErrorDialog} onHide={this.handleCloseErrorDialog.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{color: 'red'}}>{this.state.errorMessage}</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.handleCloseErrorDialog.bind(this)}>Ok</button>
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
}