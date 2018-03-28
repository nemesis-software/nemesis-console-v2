import React, {Component} from 'react';

import ApiCall from 'servicesDir/api-call';

import FilterBuilder from 'servicesDir/filter-builder';

import Translate from 'react-translate-component';

import EntitiesPager from '../entity-window/entities-viewer/entities-pager/entities-pager';

import LanguageChanger from '../language-changer';

import Modal from 'react-bootstrap/lib/Modal';

import _ from 'lodash';

import {searchRestrictionTypes} from '../../types/nemesis-types'

import SimpleEntityItemView from './simple-entity-item-view';

import EntityTypeCreationModal from '../embedded-creation/entity-type-creation-modal';

import { componentRequire } from '../../utils/require-util';
import TableHeaderElement from '../helper-components/table-header-element';


import DataHelper from 'servicesDir/data-helper';

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

export default class SimpleViewEntityWindow extends Component {
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
      openModalCreation: false,
      openDeleteConfirmation: false,
      entityIdForDelete: null,
      errorMessage: null,
      openErrorDialog: false
    };
  }

  componentWillMount() {
    this.getEntitiesData(this.props.entity.entityId, pagerData.page, pagerData.pageSize, this.state.filter, this.state.sortData);
  }

  render() {
    return (
      <div>
        {this.state.isEntitySelected ?
          <SimpleEntityItemView closeSelectedEntityView={this.closeSelectedEntityView.bind(this)}
                                openNotificationSnackbar={this.props.openNotificationSnackbar}
                                entityData={this.state.entityData}
                                entityFields={this.props.entityFields}/>
          :
          <div className="entities-window">
            <button onClick={this.onClickCreateNewEntityButton.bind(this)}>Create New entity</button>
            <EntityTypeCreationModal onModalCancel={() => {this.setState({openModalCreation: false})}}
                                     onEntityTypeSelected={this.onEntityTypeSelected.bind(this)}
                                     openModalCreation={this.state.openModalCreation}
                                     entityId={this.props.entity.entityId}/>
            <EntitiesFilter entity={{entityId: this.props.entity}}
                            filterMarkup={this.props.entity.data.filter}
                            onFilterApply={this.onFilterApply.bind(this)}/>
            <div style={this.props.style} className="entities-table-viewer entities-result-viewer paper-box">
              <table>
                <thead>
                <tr className="navigation-header">
                  <th colSpan={this.props.entity.data.result.length + 1}>
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
                    this.props.entity.data.result.map((markupItem, index) => {
                      return (
                        <TableHeaderElement  key={index} markupItem={markupItem} onSortDataChange={this.onSortDataChange.bind(this)} sortData={this.state.sortData}/>
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
                          <div style={{cursor: 'pointer', color: '#4cb2e2'}} onClick={() => this.onEntityItemClick(item)}>Edit</div>
                          {this.getPreviewLink(item)}
                          <div style={{cursor: 'pointer', color: '#F24F4B'}} onClick={() => this.onDeleteButtonClick(item.id)}>Delete</div>
                        </td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </table>
            </div>
            {this.getDeleteConfirmationDialog()}
            {this.getErrorDialog()}
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

  handleRequestError(err) {
    let errorMsg = (err && err.response && err.response.data && err.response.data.message) || err.message || err;
    this.setState({...this.state, errorMessage: errorMsg, openErrorDialog: true, isDataLoading: false})
  }

  getDeleteConfirmationDialog() {
    return (
      <Modal show={this.state.openDeleteConfirmation} onHide={this.handleCloseDeleteConfirmation.bind(this)}>
        <Modal.Header>
          <Modal.Title>Delete Entity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to delete it?</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={this.handleCloseDeleteConfirmation.bind(this)}>No</button>
          <button className="nemesis-button success-button" onClick={this.handleConfirmationDeleteButtonClick.bind(this)}>Yes</button>
        </Modal.Footer>
      </Modal>
    );
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
          <button className="nemesis-button success-button" onClick={this.handleCloseErrorDialog.bind(this)}>Ok</button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleCloseErrorDialog() {
    this.setState({...this.state, openErrorDialog: false});
  }

  onDeleteButtonClick(itemId) {
    this.setState({openDeleteConfirmation: true, entityIdForDelete: itemId})
  }

  handleCloseDeleteConfirmation() {
    this.setState({...this.state, openDeleteConfirmation: false});
  };

  handleConfirmationDeleteButtonClick() {
    ApiCall.delete(this.props.entity.entityId + '/' + this.state.entityIdForDelete).then(() => {
      this.setState({openDeleteConfirmation: false, entityIdForDelete: null}, () => {
        this.getEntitiesData(this.props.entity.entityId, this.state.page.number, this.state.page.size, this.state.filter, this.state.sortData);
        this.props.openNotificationSnackbar('Entity successfully deleted');
      })
    }, this.handleRequestError.bind(this))
  }

  onPagerChange(page, pageSize) {
    this.getEntitiesData(this.props.entity.entityId, page, pageSize, this.state.filter, this.state.sortData);
  }

  getEntityDataPromise(entityId, page, pageSize, filter, sortData) {
    let filterActual = this.getFilterWithCatalogs(filter);
    return ApiCall.get(entityId, {page: page, size: pageSize, $filter: filterActual, sort: this.buildSortArray(sortData), projection: 'search'}).then(result => {
      this.setState({...this.state, searchData: DataHelper.mapCollectionData(result.data), page: result.data.page, isDataLoading: false});
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

          if (result[index].data && result[index].data._embedded) {
            data = DataHelper.mapCollectionData(result[index].data);
          } else {
            data = DataHelper.mapEntityData(result[index].data);
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

    entityFields.mainViewItems.forEach(subItem => {
      if (subItem.entityId) {
        result.push({type: subItem.xtype, name: subItem.name});
      }
    });

    entityFields.groups.forEach(item => {
      item.items.forEach(subItem => {
        if (subItem.entityId) {
          result.push({type: subItem.xtype, name: subItem.name});
        }
      })
    });

    return result;
  }

  onClickCreateNewEntityButton() {
    this.setState({openModalCreation: true});
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
    if (entityId === 'blog_entry') {
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
        value: `${catalog}L`
      };
      catalogFilter.push(filterItem);
    });
    let actualCatalogFilter = '(' + FilterBuilder.buildFilter(catalogFilter, 'or') + ')';
    if (!filter) {
      return actualCatalogFilter;
    }

    return actualCatalogFilter + filter;
  }

  onLanguageChange(language) {
    this.setState({...this.state, selectedLanguage: language});
  }

  onSortDataChange(sortData) {
    this.setState({...this.state, sortData: sortData}, () => {
      this.getEntitiesData(this.props.entity.entityId, pagerData.page, this.state.page.size, this.state.filter, sortData);
    });
  }
}