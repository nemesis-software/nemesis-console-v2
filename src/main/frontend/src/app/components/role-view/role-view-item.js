import React, {Component} from 'react';

import ApiCall from '../../services/api-call';

import RoleViewEntityWindow from './role-view-entity-window';

import _ from 'lodash';

export default class RoleViewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isCatalogable: props.entityMarkupData[props.item].synchronizable, selectedCatalogs: null};
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
            <RoleViewEntityWindow entityId={this.props.item} searchFields={this.getEntityWindowSearchResultFields()} selectedCatalogs={this.state.selectedCatalogs} />
        }
      </div>
    )
  }

  onSiteSelect(site) {
    ApiCall.get(site._links.cmsCatalogs.href).then(result => {
      this.setState({...this.state, selectedCatalogs: this.mapCollectionData(result.data)});
    });
  }

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  getEntityWindowSearchResultFields() {
    if (this.props.item === 'blog_entry') {
      let allowedSearchFileds = ['thumbnail', 'title', 'publishDate', 'categories'];
      return _.filter(this.props.markupData[this.props.item].result, (item) => {
        return allowedSearchFileds.indexOf(item.name) > -1;
      })

    }

    return [];
  }

  getEntityWindowEntityView() {
    if (this.props.item === 'blog_entry') {
      return {
        mainView: ['code', 'title', 'content'],
        sideBar: []
      };
    }

    return {};
  }
}