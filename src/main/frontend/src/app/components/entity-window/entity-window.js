import React, {Component} from 'react';
import {entitySearchType, entityItemType} from '../../types/entity-types'
import ApiCall from '../../services/api-call';
import _ from 'lodash';
import EntitiesFilter from './entities-viewer/entities-filter/entities-filter';
import EntitiesViewer from './entities-viewer/entities-viewer';
import EntitySections from './entity-sections/entity-sections'
import Translate from 'react-translate-component';
import { nemesisFieldTypes } from '../../types/nemesis-types'

const pagerData = {
  page: 1,
  pageSize: 20
};
export default class EntitiesWindow extends Component {
  constructor(props) {
    super(props);
    // this.state = {searchData: [], entityData: {}, page: {}, filter: null};
  }
  //
  // componentWillMount() {
  //   this.getDataByEntityType(this.props.entity, pagerData.page, pagerData.pageSize, this.state.filter);
  // }

  render() {
    let styles = {
      height: 'calc(100vh - 120px)',
      overflowY: 'auto'
    };
    if (!this.props.entity.isVisible) {
      styles.display = 'none';
    }

    return (
      <div style={styles}>
        {this.renderEntityByType(this.props.entity)}
      </div>
    )
  }

  renderEntityByType(entity) {
    switch (entity.type) {
      case entityItemType: {
        return (
          <div>
            <EntitySections entity={entity}/>
          </div>
        );
      }
      case entitySearchType: {
        return (
          <EntitiesViewer entity={entity} onEntityItemClick={this.props.onEntityItemClick}/>
          // <div>
          //   <Translate component="h2" content={'main.' + entity.entityId} fallback={entity.entityId}/>
          //   <EntitiesFilter filterMarkup={this.props.entity.data.filter} onFilterApply={this.onFilterApply.bind(this)}/>
          //   <EntitiesViewer entities={this.state.searchData}
          //                   entitiesMarkup={this.props.entity.data.result}
          //                   onPagerChange={this.onPagerChange.bind(this)}
          //                   page={this.state.page}
          //                   onEntityItemClick={this.onEntityItemClick.bind(this)}/>
          // </div>
        );
      }
      default: {
        return <div>INVALID ENTITY TYPE!!!</div>
      }
    }
  }

  // onEntityItemClick(item) {
  //   this.props.onEntityItemClick(item, this.props.entity.entityId)
  // }
  //
  // onFilterApply(filter) {
  //   this.setState({...this.state, filter: filter});
  //   this.getDataByEntityType(this.props.entity, pagerData.page, this.state.page.size, filter);
  // }
  //
  // onPagerChange(page, pageSize) {
  //   this.getDataByEntityType(this.props.entity, page, pageSize, this.state.filter);
  // }

  // getDataByEntityType(entity, page, pageSize, filter) {
  //   switch (entity.type) {
  //     case entityItemType: {
  //       let relatedEntities = this.getEntityRelatedEntities(entity);
  //       ApiCall.get(entity.entityId + '/' + entity.itemId).then(result => {
  //         this.setState({...this.state, entityData: result.data});
  //         Promise.all(
  //           relatedEntities.map(item => {console.log(item); ApiCall.get(result.data._links[item.name].href, {projection: 'search'})
  //           //TODO: Patch for return 404 for empty relation - https://github.com/nemesis-software/nemesis-platform/issues/293
  //           .then(result => {
  //             return Promise.resolve(result);
  //           }, err => {
  //             return Promise.resolve({data: null});
  //           })})
  //         ).then(result => {
  //           let relatedEntitiesResult = {};
  //           relatedEntities.forEach((item, index) => {
  //             let data;
  //             if (item.type === nemesisFieldTypes.nemesisCollectionField) {
  //               data = this.mapCollectionData(result[index].data);
  //             } else {
  //               data = this.mapEntityData(result[index].data);
  //             }
  //
  //             relatedEntitiesResult[item.name] = data;
  //           });
  //           this.setState({...this.state, entityData: {...this.state.entityData, customClientData: relatedEntitiesResult}})
  //         })
  //       });
  //       return;
  //     }
  //     // case entitySearchType: {
  //     //   ApiCall.get(entity.entityId, {page: page, size: pageSize, $filter: filter, projection: 'search'}).then(result => {
  //     //     this.setState({...this.state, searchData: this.mapCollectionData(result.data), page: result.data.page});
  //     //   });
  //     //   return;
  //     // }
  //     default: {
  //       throw 'INVALID ENTITY TYPE!!!';
  //     }
  //   }
  // }
  //
  // getEntityRelatedEntities(entity) {
  //   let result = [];
  //   if (!entity) {
  //     return result;
  //   }
  //   entity.data.sections.forEach(item => {
  //     item.items.forEach(subItem => {
  //       if ([nemesisFieldTypes.nemesisCollectionField, nemesisFieldTypes.nemesisEntityField].indexOf(subItem.xtype) > -1) {
  //         result.push({type: subItem.xtype, name: subItem.name.replace('entity-', '')});
  //       }
  //     })
  //   });
  //
  //   return result;
  // }
  //
  // mapCollectionData(data) {
  //   let result = [];
  //   _.forIn(data._embedded, (value) => result = result.concat(value));
  //   return result;
  // }
  //
  // mapEntityData(data) {
  //   if (!data) {
  //     return null;
  //   }
  //
  //   return data.content || data;
  // }
}
