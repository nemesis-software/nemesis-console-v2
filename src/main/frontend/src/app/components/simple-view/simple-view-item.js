import React, {Component} from 'react';

import ApiCall from '../../services/api-call';

import SimpleViewEntityWindow from './simple-view-entity-window';

import PropTypes from 'prop-types';

export default class SimpleViewItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {isCatalogable: context.entityMarkupData[props.item].synchronizable, selectedCatalogVersions: null, selectedSite: null};
  }

  render() {
    return (
      <div>
        {
          this.state.isCatalogable && !this.state.selectedCatalogVersions ?
            <div className="simple-view-wrapper">{this.props.sites.map(site => {
                return (
                  <div className="simple-view-item-selector" key={site.code} onClick={() => {this.onSiteSelect(site)}}>
                    {site.name}
                  </div>
                )
              }
            )}</div> :
            <SimpleViewEntityWindow entity={{entityId: this.props.item, data: this.context.markupData[this.props.item]}}
                                    openNotificationSnackbar={this.props.openNotificationSnackbar}
                                  entityFields={this.getEntityFields()}
                                  selectedSite={this.state.selectedSite}
                                  selectedCatalogVersions={this.state.selectedCatalogVersions} />
        }
      </div>
    )
  }

  onSiteSelect(site) {
    ApiCall.get('backend/catalog-versions', {siteCode: site.code}).then(result => {
      let selectedCatalogsVersions = result.data.map(item => item.id);
      this.setState({...this.state, selectedCatalogVersions: selectedCatalogsVersions, selectedSite: site});
    });

  }

  getEntityFields() {
    return this.context.entityMarkupData[this.props.item].simpleView;
  }
}

SimpleViewItem.contextTypes = {
  markupData: PropTypes.object,
  entityMarkupData: PropTypes.object
};
