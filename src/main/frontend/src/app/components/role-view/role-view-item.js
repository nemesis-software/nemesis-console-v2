import React, {Component} from 'react';

import ApiCall from '../../services/api-call';

import RoleViewEntityWindow from './role-view-entity-window';

import PropTypes from 'prop-types';

import _ from 'lodash';

export default class RoleViewItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {isCatalogable: context.entityMarkupData[props.item].synchronizable, selectedCatalogVersions: null, selectedSite: null};
  }

  render() {
    return (
      <div>
        {
          this.state.isCatalogable && !this.state.selectedCatalogVersions ?
            <div>{this.props.sites.map(site => {
                return (
                  <div className="role-view-item-selector" key={site.code} onClick={() => {this.onSiteSelect(site)}}>
                    {site.name}
                  </div>
                )
              }
            )}</div> :
            <RoleViewEntityWindow entity={{entityId: this.props.item, data: this.context.markupData[this.props.item]}} entityFields={this.getEntityFields()} selectedSite={this.state.selectedSite} selectedCatalogVersions={this.state.selectedCatalogVersions} />
        }
      </div>
    )
  }

  onSiteSelect(site) {
    ApiCall.get(site._links.cmsCatalogs.href).then(result => {
      let selectedCatalogs = this.mapCollectionData(result.data);
      Promise.all(selectedCatalogs.map(catalog => ApiCall.get(catalog._links.catalogVersions.href))).then(result => {
        let selectedCatalogVersion = [];
        result.forEach(catalogVersion => {
          selectedCatalogVersion = selectedCatalogVersion.concat(this.mapCollectionData(catalogVersion.data));
        });
        console.log(selectedCatalogVersion);
        this.setState({...this.state, selectedCatalogVersions: selectedCatalogVersion, selectedSite: site});
      });
    });
  }

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  getEntityFields() {
    if (this.props.item === 'blog_entry') {
      let flattedFields = [];

      this.context.entityMarkupData[this.props.item].sections.forEach(section => {
        flattedFields = flattedFields.concat(section.items);
      });
      let config = this.context.quickViewData[this.props.item];

      let mainViewActual = [];
      _.forEach(config.mainView, item => {
        let itemIndex = _.findIndex(flattedFields, (field) => {
          return field.name === item.name;
        });

        if (itemIndex > -1) {
          mainViewActual.push({field: flattedFields[itemIndex], embeddedCreation: item.embeddedCreation});
        }
      });

      let sideBarActual = [];
      _.forEach(config.sideBar, sideBarItem => {
        let sideBarItemActual = [];
        _.forEach(sideBarItem.items, (item) => {
          let itemIndex = _.findIndex(flattedFields, (field) => {
            return field.name === item.name;
          });
          if (itemIndex > -1) {
            sideBarItemActual.push({field: flattedFields[itemIndex], embeddedCreation: item.embeddedCreation});
          }
        });

        sideBarActual.push({
          groupName: sideBarItem.groupName,
          items: sideBarItemActual
        });
      });

      return {mainView: mainViewActual, sideBar: sideBarActual};
    }

    return {};
  }
}

RoleViewItem.contextTypes = {
  markupData: PropTypes.object,
  entityMarkupData: PropTypes.object,
  quickViewData: PropTypes.object
};