import React, {Component} from 'react';

import ApiCall from 'servicesDir/api-call';

import Translate from 'react-translate-component';

import _ from 'lodash';

import {nemesisFieldTypes} from '../../types/nemesis-types'

import RoleEntityItemView from './role-entity-item-view';

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
    this.state = {searchData: [], page: {}, sortData: [], filter: null, isDataLoading: false, isEntitySelected: false, selectedLanguage: translationLanguages.defaultLanguage.value};
  }

  componentWillMount() {
    this.getEntitiesData(this.props.entityId, pagerData.page, pagerData.pageSize, this.state.filter, this.state.sortData);
  }

  render() {
    return (
      <div>
        {this.state.isEntitySelected ?
          <RoleEntityItemView closeSelectedEntityView={this.closeSelectedEntityView.bind(this)} entityId={this.props.entityId} entityData={this.state.entityData} entityFields={this.props.entityFields}/>
          :
          <div style={this.props.style} className="entities-table-viewer">
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
                  this.props.searchFields.map((markupItem, index) => {
                    return (
                      <Translate key={index} component="th" content={'main.' + markupItem.text} fallback={markupItem.text}/>
                    )})
                }
                <Translate  component="th" content={'main.actions'} fallback={'Actions'}/>
              </tr>
              </thead>
              <tbody>
              {
                this.state.searchData.map((item, index) => {
                  return (
                    <tr key={index}>
                      {
                        this.props.searchFields.map((markupItem, index) => this.getTableRowColumnItem(item, markupItem, index))
                      }
                      <td>
                        <div onClick={() => this.onEntityItemClick(item)}>Edit</div>
                        <div>Preview</div>
                        <div>Delete</div>
                      </td>
                    </tr>
                  )
                })
              }
              </tbody>
            </table>
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
    return ApiCall.get(entityId, {page: page, size: pageSize, $filter: filter, sort: this.buildSortArray(sortData), projection: 'search'}).then(result => {
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

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  closeSelectedEntityView(shouldDataReload) {
    if (shouldDataReload) {
      this.setState({...this.state, isEntitySelected: false})
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
        this.setState({...this.state, entityData: {...this.state.entityData, customClientData: relatedEntitiesResult}, isDataLoading: false, isEntitySelected: true})
      })
    });
  }

  getEntityRelatedEntities(entityFields) {
    let result = [];
    if (!entityFields) {
      return result;
    }

    entityFields.mainView.forEach(subItem => {
      if ([nemesisFieldTypes.nemesisCollectionField, nemesisFieldTypes.nemesisEntityField].indexOf(subItem.xtype) > -1) {
        result.push({type: subItem.xtype, name: subItem.name.replace('entity-', '')});
      }
    });

    entityFields.sideBar.forEach(item => {
      item.items.forEach(subItem => {
        if ([nemesisFieldTypes.nemesisCollectionField, nemesisFieldTypes.nemesisEntityField].indexOf(subItem.xtype) > -1) {
          result.push({type: subItem.xtype, name: subItem.name.replace('entity-', '')});
        }
      })
    });

    console.log('relatedEntities', result);
    return result;
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
}