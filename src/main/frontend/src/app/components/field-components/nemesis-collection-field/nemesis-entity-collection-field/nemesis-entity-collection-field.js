import React from 'react';
import NemesisBaseCollectionField from '../nemesis-base-collection-field';
import AutoComplete from 'material-ui/AutoComplete';
import ApiCall from '../../../../services/api-call';
import _ from 'lodash';
import Translate from 'react-translate-component';

export default class NemesisEntityCollectionField extends NemesisBaseCollectionField {
  constructor(props) {
    super(props);
    this.state = {...this.state, searchText: '', dataSource: []};
  }

  getInputField() {
    return (
      <AutoComplete style={this.props.style}
                    dataSource={this.state.dataSource}
                    filter={(searchText, key) => true}
                    onFocus={this.onAutocompleteFocus.bind(this)}
                    onUpdateInput={_.debounce(this.onTextFieldChange.bind(this), 250)}
                    openOnFocus={true}
                    disabled={this.props.readOnly}
                    onNewRequest={this.onItemSelect.bind(this)}
                    listStyle={{width: 'auto'}}
                    menuStyle={{width: 'auto', maxHeight: '300px'}}
                    maxSearchResults={10}
                    searchText={this.state.searchText}
                    floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}/>
    )
  }

  filterEntityData(inputText) {
    let inputTextActual = inputText || '';
    ApiCall.get(this.getSearchUrl(), {page: 1, size: 10, code: inputTextActual, projection: 'search'}).then(result => {
      let data = [];
      _.forIn(result.data._embedded, (value) => data = data.concat(value));
      let mappedData = data.map(this.mapDataSource.bind(this));
      this.setState({...this.state, dataSource: mappedData});
    })
  }

  onItemSelect(item) {
    let valueActual = this.state.value || [];
    valueActual.push(item.value);
    this.setState({...this.state, isDirty: true, value: valueActual, searchText: ''});
  }

  getSearchUrl() {
    let urlSuffix = '/search/findByCodeIsStartingWithIgnoreCase/';
    return `${this.props.entityId}${urlSuffix}`;
  }

  onAutocompleteFocus() {
    this.filterEntityData(this.state.searchText);
  }

  onTextFieldChange(value) {
    this.filterEntityData(value);
    this.setState({...this.state, searchText: value});
  }

  mapDataSource(item) {
    return {
      value: item,
      text: this.getAutocompleteRenderingValue(item)
    }
  }

  getAutocompleteRenderingValue(item) {
    return item.code;
  }

  getFormattedValue() {
    return this.state.value.map(item => item.id);
  }

  getItemRenderingValue(item) {
    return <div>{item.code}<i className="material-icons collection-item-icon" onClick={() =>  this.props.onEntityItemClick(item, this.props.entityId, item._links.self.href)}>launch</i></div>
  }
}