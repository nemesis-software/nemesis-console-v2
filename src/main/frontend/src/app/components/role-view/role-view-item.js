import React, {Component} from 'react';

import ApiCall from '../../services/api-call';

import RoleViewEntityWindow from './role-view-entity-window';

import _ from 'lodash';

export default class RoleViewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isCatalogable: props.entityMarkupData[props.item].synchronizable, selectedCatalogs: null, selectedSite: null};
  }

  render() {
    return (
      <div>
        Role view item
        {
          this.state.isCatalogable && !this.state.selectedCatalogs ?
            <div>{this.props.sites.map(site => {
                return (
                  <div className="role-view-item-selector" key={site.code} onClick={() => {this.onSiteSelect(site)}}>
                    {site.name}
                  </div>
                )
              }
            )}</div> :
            <RoleViewEntityWindow entityId={this.props.item} entityFields={this.getEntityFields()} searchFields={this.getEntityWindowSearchResultFields()} selectedCatalogs={this.state.selectedCatalogs} />
        }
      </div>
    )
  }

  onSiteSelect(site) {
    ApiCall.get(site._links.cmsCatalogs.href).then(result => {
      this.setState({...this.state, selectedCatalogs: this.mapCollectionData(result.data), selectedSite: site});
    });
  }

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  getEntityWindowSearchResultFields() {
    if (this.props.item === 'blog_entry') {
      let allowedSearchFileds = ['title', 'thumbnail', 'publishDate', 'categories'];
      return _.filter(this.props.markupData[this.props.item].result, (item) => {
        return allowedSearchFileds.indexOf(item.name) > -1;
      })
    }

    return [];
  }

  getEntityFields() {
    if (this.props.item === 'blog_entry') {
      let flattedFields = [];

      this.props.entityMarkupData[this.props.item].sections.forEach(section => {
        flattedFields = flattedFields.concat(section.items);
      });
      console.log(flattedFields);
      let config = {
        mainView: ['code', 'title', 'content'],
        sideBar: [
          {groupName: 'Status', items: ['publishDate', 'entity-thumbnail']},
          {groupName: 'Images', items: ['publishDate', 'entity-thumbnail']},
          {groupName: 'Addition fields', items: ['publishDate', 'entity-thumbnail']},
        ]
      };

      let result = {mainView: null, sideBar: []};
      result.mainView = _.filter(flattedFields, item => {
        return config.mainView.indexOf(item.name) > -1;
      });

      _.forEach(config.sideBar, sideBarItem => {
        result.sideBar.push({
          groupName: sideBarItem.groupName,
          items: _.filter(flattedFields, item => {
            return sideBarItem.items.indexOf(item.name) > -1;
          })
        });
      });

      return result;
    }

    return {};
  }
}