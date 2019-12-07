import React, { Component } from 'react';

import ApiCall from 'servicesDir/api-call';

import {Dropdown} from 'react-bootstrap';

import DataHelper from 'servicesDir/data-helper';

export default class GlobalFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {sites: [], selectedIndex: 'allSites'};
  }

  componentDidMount() {
    ApiCall.get('site').then(result => {
      this.setState({sites: DataHelper.mapCollectionData(result.data)});
    })
  }

  render() {
    if (this.state.sites.length <= 1) {
      return false;
    }

    return (
      <Dropdown id="global-filter-sites" className="global-filter-dropdown">
        <Dropdown.Toggle className="live-edit-toggle" >
          <div className="live-edit-dropdown-content"><i className={'fa fa-filter' + ('allSites' !== this.state.selectedIndex ? ' has-filter' : '')} /> Global filter <i className="material-icons arrow-icon">keyboard_arrow_down</i></div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="super-colors">
          <Dropdown.Item className="live-edit-dropdown-item" active={'allSites' === this.state.selectedIndex} key={'allSites'} onClick={() => this.onSiteSelect(null, 'allSites')}>All sites</Dropdown.Item>
          {this.state.sites.map((site, index) => {
            return <Dropdown.Item className="live-edit-dropdown-item" active={index === this.state.selectedIndex} key={index} onClick={() => this.onSiteSelect(site, index)}>{site.name}</Dropdown.Item>
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  
  onSiteSelect(site, index) {
    if (index === this.state.selectedIndex) {
      return;
    }

    this.setState({selectedIndex: index});

    if (site) {
        this.props.onGlobalFilterSelect(ApiCall.get('backend/catalog-versions', {siteCode: site.code}));
    } else {
      this.props.onGlobalFilterSelect(Promise.resolve({data: []}))
    }

  }
}