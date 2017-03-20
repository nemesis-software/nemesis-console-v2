import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import Translate from 'react-translate-component';
import ApiCall from '../../../services/api-call';
import _ from 'lodash';
import { nemesisFieldUsageTypes } from '../../../types/nemesis-types';
import NemesisBaseField from '../nemesis-base-field'

export default class NemesisEntityField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = {...this.state, searchText: this.getItemText(this.state.value), dataSource: []};
  }

  render() {
    return (
    <div className="entity-field-container">
      <AutoComplete className="entity-field"
                    style={this.props.style}
                    dataSource={this.state.dataSource}
                    filter={(searchText, key) => true}
                    onFocus={this.onAutocompleteFocus.bind(this)}
                    onBlur={this.onAutocompleteBlur.bind(this)}
                    onUpdateInput={_.debounce(this.onTextFieldChange.bind(this), 250)}
                    openOnFocus={true}
                    disabled={this.props.readOnly}
                    onNewRequest={(item) => this.onValueChange(item.value)}
                    listStyle={{width: 'auto'}}
                    menuStyle={{width: 'auto', maxHeight: '300px'}}
                    maxSearchResults={10}
                    searchText={this.state.searchText}
                    floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}/>
      {this.props.type === nemesisFieldUsageTypes.edit ? <i className="material-icons entity-navigation-icon" onClick={this.openEntityWindow.bind(this)}>launch</i> : false}
    </div>

    )
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.value, nextProps.value)) {
      if (!nextProps.value) {
        return;
      }
      this.setState({...this.state, isDirty: false, value: this.setFormattedValue(nextProps.value), searchText: this.getItemText(nextProps.value)})
    }
  }

  onAutocompleteFocus() {
    this.setState({...this.state, searchText: ''});
    this.filterEntityData('');
  }

  onAutocompleteBlur() {
    this.setState({...this.state, searchText: this.getItemText(this.state.value)});
  }

  onValueChange(value) {
    this.setState({...this.state, isDirty: true, value: value, searchText: this.getItemText(value)});
    if (this.props.onValueChange) {
      this.props.onValueChange(this.getFormattedValue(value));
    }
  }

  onTextFieldChange(value) {
    this.filterEntityData(value);
    this.setState({...this.state, searchText: value});
  }

  getFormattedValue(value) {
    return value.id;
  }

  filterEntityData(inputText) {
    let inputTextActual = inputText || '';
    ApiCall.get(this.getSearchUrl(), {page: 1, size: 10, catalogCode: inputTextActual, code: inputTextActual, projection: 'search'}).then(result => {
      let data = [];
      _.forIn(result.data._embedded, (value) => data = data.concat(value));
      let mappedData = data.map(this.mapDataSource.bind(this));
      this.setState({...this.state, dataSource: mappedData});
    })
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
      text: this.getItemText(item)
    }
  }

  getItemText(item) {
    if (!item) {
      return '';
    }
    let text = item.code;

    if (this.props.entityId === 'catalog_version') {
      text = item.catalogVersion || item.code;
    } else if (item.catalogVersion){
      text = `${item.code} - ${item.catalogVersion}`
    }

    return text;
  }

  openEntityWindow() {
    if (this.state.value) {
      this.props.onEntityItemClick(this.state.value, this.props.entityId);
    }
  }
}