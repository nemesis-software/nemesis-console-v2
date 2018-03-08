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
            <RoleViewEntityWindow entity={{entityId: this.props.item, data: this.context.markupData[this.props.item]}}
                                  entityFields={this.getEntityFields()}
                                  selectedSite={this.state.selectedSite}
                                  selectedCatalogVersions={this.state.selectedCatalogVersions} />
        }
      </div>
    )
  }

  onSiteSelect(site) {
    ApiCall.get('backend/catalog-versions', {siteCode: site.code}).then(result => {
      let selectedCatalogsVersions = result.data;
      this.setState({...this.state, selectedCatalogVersions: selectedCatalogsVersions, selectedSite: site});
    });

  }

  getEntityFields() {
    return this.context.entityMarkupData[this.props.item].simpleView;
  }
}

RoleViewItem.contextTypes = {
  markupData: PropTypes.object,
  entityMarkupData: PropTypes.object
};