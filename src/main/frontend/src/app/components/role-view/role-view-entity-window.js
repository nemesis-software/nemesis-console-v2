import React, {Component} from 'react';

import ApiCall from 'servicesDir/api-call';

import FilterBuilder from 'servicesDir/filter-builder';

import Translate from 'react-translate-component';

import _ from 'lodash';

import {nemesisFieldTypes, searchRestrictionTypes} from '../../types/nemesis-types'

import RoleEntityItemView from './role-entity-item-view';

import EntityTypeCreationModal from '../embedded-creation/entity-type-creation-modal';

import { componentRequire } from '../../utils/require-util';

let EntitiesFilter = componentRequire('app/components/entity-window/entities-viewer/entities-filter/entities-filter', 'entities-filter');

const pagerData = {
  page: 0,
  pageSize: 20
};

const translationLanguages = {
  languages: [
    {value: 'en', labelCode: 'English'},
    {value: 'bg_BG', labelCode: 'Bulgarian'},
  ],
  defaultLanguage: {value: 'en', labelCode: 'English'}
};

export default class RoleViewEntityWindow extends Component {
  constructor(props) {
    super(props);
    this.getEntityPromise = null;
    this.state = {
      searchData: [],
      page: {},
      sortData: [],
      filter: null,
      isDataLoading: false,
      isEntitySelected: false,
      selectedLanguage: translationLanguages.defaultLanguage.value,
      openModalCreation: false
    };
  }

  componentWillMount() {
    this.getEntitiesData(this.props.entity.entityId, pagerData.page, pagerData.pageSize, this.state.filter, this.state.sortData);
  }

  render() {
    return (
      <div>
        {this.state.isEntitySelected ?
          <RoleEntityItemView closeSelectedEntityView={this.closeSelectedEntityView.bind(this)} entityData={this.state.entityData}
                              entityFields={this.props.entityFields}/>
          :
          <div className="entities-window">
            <button onClick={this.onClickCreateNewEntityButton.bind(this)}>Create New entity</button>
            <EntityTypeCreationModal onModalCancel={() => {
              this.setState({openModalCreation: false})
            }} onEntityTypeSelected={this.onEntityTypeSelected.bind(this)}
                                     openModalCreation={this.state.openModalCreation} entityId={this.props.entity.entityId}/>
            <EntitiesFilter entity={{entityId: this.props.entity}} filterMarkup={this.props.entity.data.filter} onFilterApply={this.onFilterApply.bind(this)}/>
            <div style={this.props.style} className="entities-table-viewer entities-result-viewer paper-box">
              <table>
                <thead>
                {/*<tr className="navigation-header">*/}
                {/*<th colSpan={this.state.entitiesMarkup.length}>*/}
                {/*<LanguageChanger*/}
                {/*label="language"*/}
                {/*onLanguageChange={this.onLanguageChange.bind(this)}*/}
                {/*availableLanguages={translationLanguages.languages}*/}
                {/*selectedLanguage={translationLanguages.defaultLanguage}*/}
                {/*/>*/}
                {/*<EntitiesPager onPagerChange={this.props.onPagerChange} page={this.props.page}/>*/}
                {/*</th>*/}
                {/*</tr>*/}
                <tr className="content-header">
                  {
                    this.props.entity.data.result.map((markupItem, index) => {
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
                          this.props.entity.data.result.map((markupItem, index) => this.getTableRowColumnItem(item, markupItem, index))
                        }
                        <td>
                          <div onClick={() => this.onEntityItemClick(item)}>Edit</div>
                          {this.getPreviewLink(item)}
                          <div>Delete</div>
                        </td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    )
  }

  getEntitiesData(entityId, page, pageSize, filter, sortData) {
    this.setState({...this.state, isDataLoading: true});

    if (this.getEntityPromise) {
      this.getEntityPromise.then(() => {
        this.setState({...this.state, isDataLoading: true});
        this.getEntityPromise = this.getEntityDataPromise(entityId, page, pageSize, filter, sortData);
        return this.getEntityPromise;
      })
    } else {
      this.getEntityPromise = this.getEntityDataPromise(entityId, page, pageSize, filter, sortData);
    }
  }

  getEntityDataPromise(entityId, page, pageSize, filter, sortData) {
    let filterActual = this.getFilterWithCatalogs(filter);
    return ApiCall.get(entityId, {page: page, size: pageSize, $filter: filterActual, sort: this.buildSortArray(sortData), projection: 'search'}).then(result => {
      this.setState({...this.state, searchData: this.mapCollectionData(result.data), page: result.data.page, isDataLoading: false});
    });
  }

  buildSortArray(sortData) {
    sortData = sortData || [];
    let result = [];
    _.forEach(sortData, sortElement => {
      result.push(`${sortElement.field},${sortElement.orderType}`);
    });
    return result;
  }

  closeSelectedEntityView(shouldDataReload) {
    if (shouldDataReload) {
      this.setState({...this.state, isEntitySelected: false}, () => {
        this.getEntitiesData(this.props.entity.entityId, this.state.page.number, this.state.page.size, this.state.filter, this.state.sortData);
      })
    } else {
      this.setState({...this.state, isEntitySelected: false})
    }
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

  onEntityItemClick(item) {
    this.getDataEntity(item);
  }

  getDataEntity(entity) {
    this.setState({...this.state, isDataLoading: true});
    let relatedEntities = this.getEntityRelatedEntities(this.props.entityFields);
    let restUrl = entity.entityUrl || (entity.entityName + '/' + entity.id);
    return ApiCall.get(restUrl).then(result => {
      this.setState({...this.state, entityData: result.data});
      Promise.all(
        relatedEntities.map(item => result.data._links[item.name] ? ApiCall.get(result.data._links[item.name].href, {projection: 'search'})
          .then(result => {
            return Promise.resolve(result);
          }, err => {
            return Promise.resolve({data: null});
          }) : Promise.resolve({data: null}))
      ).then(result => {
        let relatedEntitiesResult = {};
        relatedEntities.forEach((item, index) => {
          let data;
          if (item.type === nemesisFieldTypes.nemesisCollectionField) {
            data = this.mapCollectionData(result[index].data);
          } else {
            data = this.mapEntityData(result[index].data);
          }

          relatedEntitiesResult[item.name] = data;
        });
        this.setState({
          ...this.state,
          entityData: {...this.state.entityData, customClientData: relatedEntitiesResult},
          isDataLoading: false,
          isEntitySelected: true
        })
      })
    });
  }

  getEntityRelatedEntities(entityFields) {
    let result = [];
    if (!entityFields) {
      return result;
    }

    entityFields.mainView.forEach(subItem => {
      if ([nemesisFieldTypes.nemesisCollectionField, nemesisFieldTypes.nemesisEntityField].indexOf(subItem.field.xtype) > -1) {
        result.push({type: subItem.field.xtype, name: subItem.field.name.replace('entity-', '')});
      }
    });

    entityFields.sideBar.forEach(item => {
      item.items.forEach(subItem => {
        if ([nemesisFieldTypes.nemesisCollectionField, nemesisFieldTypes.nemesisEntityField].indexOf(subItem.field.xtype) > -1) {
          result.push({type: subItem.field.xtype, name: subItem.field.name.replace('entity-', '')});
        }
      })
    });

    console.log('relatedEntities', result);
    return result;
  }

  onClickCreateNewEntityButton() {
    this.setState({openModalCreation: true});
  }

  mapCollectionData(data) {
    let result = [];

    if (!data) {
      return result;
    }

    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  mapEntityData(data) {
    if (!data) {
      return null;
    }

    return data.content && data.content.id ? data.content : data;
  }

  onEntityTypeSelected(selectedEntityName) {
    this.setState({openModalCreation: false, entityData: {entityName: selectedEntityName}, isEntitySelected: true})
  }

  onFilterApply(filter) {
    this.setState({...this.state, filter: filter}, () => {
      this.getEntitiesData(this.props.entity.entityId, pagerData.page, this.state.page.size, filter, this.state.sortData);
    });
  }

  getPreviewLink(entity) {
    let entityId = this.props.entity.entityId;
    if (entityId === 'blog_entry' || entityId === 'product') {
      if (!entity.active) {
        return false;
      }
      let siteUrl = document.getElementById('website-base-url').getAttribute('url');
      let actualUrl = `${siteUrl}blog/${entity.code}?site=${this.props.selectedSite.code}`;
      return (
        <div><a href={actualUrl} target="_blank">Preview</a></div>
      )
    }
    return false;
  }

  getFilterWithCatalogs(filter) {
    let catalogFilter = [];
    _.forEach(this.props.selectedCatalogVersions, catalog => {
      let filterItem = {
        restriction: searchRestrictionTypes.equals,
        field: 'catalogVersion/id',
        value: `${catalog.id}L`
      };
      catalogFilter.push(filterItem);
    });
    let actualCatalogFilter = '(' + FilterBuilder.buildFilter(catalogFilter, 'or') + ')';
    if (!filter) {
      return actualCatalogFilter;
    }

    return actualCatalogFilter + filter;
  }
}