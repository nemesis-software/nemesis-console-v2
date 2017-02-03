import React, { Component } from 'react';
import FilterRestrictionFields from '../filter-restriction-field/filter-restriction-field';
import AutoComplete from 'material-ui/AutoComplete';
import Translate from 'react-translate-component';
import { searchRestrictionTypes } from '../../../../../types/nemesis-types';
import ApiCall from '../../../../../services/api-call';
import _ from 'lodash';

const restrictionFields = [
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull,
  searchRestrictionTypes.equals
];

const styles = {
  verticalAlign: 'top',
  marginRight: '10px'
};

export default class FilterEntityField extends Component {
  constructor(props) {
    super(props);
    this.state = {restrictionField: null, textField: null, dataSource: [], selectedId: null};
  }

  render() {
    return (
      <div>
        <FilterRestrictionFields onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <AutoComplete style={this.getTextFieldStyles()}
                      dataSource={this.state.dataSource}
                      filter={(searchText, key) => true}
                      onFocus={() => this.filterEntityData(this.state.textField)}
                      onUpdateInput={_.debounce(this.onTextFieldChange.bind(this), 250)}
                      openOnFocus={true}
                      onNewRequest={this.onSelectedMenuItem.bind(this)}
                      listStyle={{width: 'auto'}}
                      menuStyle={{width: 'auto', maxHeight: '300px'}}
                      maxSearchResults={10}
                      floatingLabelText={<Translate content={'main.' + this.props.filterItem.fieldLabel} fallback={this.props.filterItem.fieldLabel} />}/>
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.selectedId, restrictionValue);
  }

  onTextFieldChange(value) {
    console.log(value);
    this.filterEntityData(value);
    this.setState({...this.state, textField: value});
  }

  updateParentFilter(selectedId, restrictionValue) {
    this.props.onFilterChange({
      value: _.isEmpty(selectedId) ? null : `${selectedId}L`,
      restriction: restrictionValue,
      field: this.props.filterItem.name.replace('entity-', '') + '/id',
      id: this.props.filterItem.name
    });
  }

  onSelectedMenuItem(item) {
    this.setState({...this.state, selectedId: item.value});
    this.updateParentFilter(item.value, this.state.restrictionField);
  }

  getTextFieldStyles() {
    let result = {...styles};
    if ([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1) {
      result.display = 'none';
    }

    return result;
  }

  filterEntityData(inputText) {
    let inputTextActual = inputText || '';
    ApiCall.get(this.getSearchUrl(this.props.filterItem), {page: 1, size: 10, catalogCode: inputTextActual, code: inputTextActual, projection: 'search'}).then(result => {
      let data = [];
      _.forIn(result.data._embedded, (value) => data = data.concat(value));
      let mappedData = data.map(this.mapDataSource.bind(this));
      this.setState({...this.state, dataSource: mappedData});
    })
  }

  getSearchUrl(filterItem) {
    let urlSuffix = '/search/findByCodeIsStartingWithIgnoreCase/';
    if (filterItem.entityId === 'catalog_version') {
      urlSuffix = '/search/findByCodeIsStartingWithIgnoreCaseOrCatalogCodeIsStartingWithIgnoreCase/';
    }

    return `${filterItem.entityId}${urlSuffix}`;
  }

  mapDataSource(item) {
    let text = item.code;

    if (this.props.filterItem.entityId === 'catalog_version') {
      text = item.catalogVersion;
    } else if (item.catalogVersion){
      text = `${item.code} - ${item.catalogVersion}`
    }

    return {
      value: item.id,
      text: text
    }
  }
}