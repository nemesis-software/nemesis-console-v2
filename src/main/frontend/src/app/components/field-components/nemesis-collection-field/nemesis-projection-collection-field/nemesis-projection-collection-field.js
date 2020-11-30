import React from 'react';
import NemesisBaseCollectionField from '../nemesis-base-collection-field';

import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import SelectCustomArrow from '../../../helper-components/select-custom-arrow';


import LanguageChanger from '../../../language-changer';

import EntitiesPager from '../../../entity-window/entities-viewer/entities-pager/entities-pager';
import EmbeddedCreation from '../../../embedded-creation/embedded-creation';

import Translate from 'react-translate-component';
import {nemesisFieldUsageTypes} from "../../../../types/nemesis-types";
import PropTypes from "prop-types";
import ApiCall from "../../../../services/api-call";

const translationLanguages = {
  languages: [
    {value: 'en', labelCode: 'English'},
    {value: 'bg_BG', labelCode: 'Bulgarian'},
  ],
  defaultLanguage: {value: 'en', labelCode: 'English'}
};

export default class NemesisProjectionCollectionField extends NemesisBaseCollectionField {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      openEmbeddedCreation: false,
      searchData: props.value.slice(0, 20),
      page: {number: 0, size: 20, totalPages: this.getTotalPages(props.value.length, 20)},
      selectedLanguage: translationLanguages.defaultLanguage.value,
      markupData: context.markupData[props.entityId].result
    };
  }

  getItemsRender() {
    return (
      <div style={this.props.style} className="entities-table-viewer entities-result-viewer paper-box projection-table">
        <table>
          <thead>
          <tr className="navigation-header">
            <th colSpan={this.state.markupData.length + 1}>
              <LanguageChanger
                label="language"
                onLanguageChange={this.onLanguageChange.bind(this)}
                availableLanguages={translationLanguages.languages}
                selectedLanguage={translationLanguages.defaultLanguage}
              />
              <EntitiesPager onPagerChange={this.onPagerChange.bind(this)}
                             page={this.state.page}/>
            </th>
          </tr>
          <tr className="content-header">
            {
              this.state.markupData.map((markupItem, index) => {
                return (
                  <Translate key={index} component="th" content={'main.' + markupItem.text} fallback={markupItem.text}/>
                )
              })
            }
            <Translate component="th" content={'main.actions'} fallback={'Actions'}/>
          </tr>
          </thead>
          <tbody>
          {
            this.state.searchData.map((item, index) => {
              return (
                <tr key={index}>
                  {
                    this.state.markupData.map((markupItem, index) => this.getTableRowColumnItem(item, markupItem, index))
                  }
                  <td>
                    {this.props.type !== nemesisFieldUsageTypes.quickView ? <i style={{verticalAlign: 'top'}} className="material-icons"
                                                                               onClick={() => this.props.onEntityItemClick(item, this.props.entityId, item._links.self.href)}>launch</i> : false}
                    {!this.props.readOnly ? <i className="material-icons delete-icon" onClick={() => this.onDeleteRequest(index)}>delete_forever</i> : false}
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    )
  }

  getInputField() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label}/>{this.props.required ?
            <span className="required-star">*</span> : false}</div>
          <AsyncSelect style={this.getSelectStyle()}
                        cache={false}
                        className={'entity-field' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                        arrowRenderer={() => <SelectCustomArrow/>}
                        disabled={this.props.readOnly}
                        onChange={this.onItemSelect.bind(this)}
                        loadOptions={this.filterEntityData.bind(this)}/>
          {this.getAdditionalIconFunctionality()}
          {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        </div>

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

  getTotalPages(itemCount, pageSize) {
    if (itemCount === 0) {
      return 1;
    }

    return Math.ceil(itemCount / pageSize);
  }

  onPagerChange(page, pageSize) {
    let pageObj = this.state.page;
    pageObj.number = page;
    pageObj.size = pageSize;
    let actualValue = this.state.value || [];
    pageObj.totalPages = this.getTotalPages(actualValue.length, pageSize);
    this.setState({searchData: actualValue.slice(page * pageSize, (page * pageSize) + pageSize), page: pageObj});
  }

  getTableRowColumnItem(item, markupItem, index) {
    let itemValue = item[markupItem.name];
    if (['nemesisLocalizedRichtextField', 'nemesisLocalizedTextField'].indexOf(markupItem.type) > -1) {
      itemValue = item[markupItem.name][this.state.selectedLanguage] && item[markupItem.name][this.state.selectedLanguage].value;
    }
    itemValue = isFinite(itemValue) && itemValue !== null ? itemValue + '' : itemValue;
    itemValue = (typeof itemValue === 'object' && itemValue !== null) ? JSON.stringify(itemValue) : itemValue;


    let style = {
      maxWidth: '100px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    };

    return (
      <td style={style} key={index}>{itemValue || ''}</td>
    )
  }

  onItemSelect(item) {
    let pageObj = this.state.page;
    let valueActual = this.state.value || [];
    valueActual.push(item.value);
    pageObj.totalPages = this.getTotalPages(valueActual.length, pageObj.size);
    let startRange = this.state.page.number * this.state.page.size;
    this.setState({
      ...this.state,
      isDirty: true,
      page: pageObj,
      value: valueActual,
      searchData: valueActual.slice(startRange, startRange + this.state.page.size)
    });
  }

  onDeleteRequest(itemIndex) {
    let pageObj = this.state.page;
    let itemIndexActual = pageObj.size * pageObj.number + itemIndex;
    let valueActual = this.state.value || [];
    valueActual.splice(itemIndexActual, 1);
    if (this.state.searchData.length === 1 && pageObj.number !== 0) {
      pageObj.number = pageObj.number - 1;
    }
    pageObj.totalPages = this.getTotalPages(valueActual.length, pageObj.size);
    let startRange = pageObj.number * this.state.page.size;
    this.setState({
      ...this.state,
      isDirty: true,
      page: pageObj,
      value: valueActual,
      searchData: valueActual.slice(startRange, startRange + this.state.page.size)
    });

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

  mapDataSource(item) {
    return {
      value: item,
      label: this.getAutocompleteRenderingValue(item)
    }
  }

  getSearchUrl() {
    let urlSuffix = '/search/findByCodeLike/';
    return `${this.props.entityId}${urlSuffix}`;
  }

  getAutocompleteRenderingValue(item) {
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

  openEmbeddedCreation() {
    this.setState({openEmbeddedCreation: true});
  }

  onCreateEmbeddedEntity(entity) {
    this.setState({openEmbeddedCreation: false}, () => {
      this.onItemSelect({value:entity});
    })
  }

  onLanguageChange(language) {
    this.setState({...this.state, selectedLanguage: language});
  }
}

NemesisProjectionCollectionField.contextTypes = {
  markupData: PropTypes.object
};
