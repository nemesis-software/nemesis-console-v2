import React, { Component } from 'react';

import ApiCall from '../services/api-call';

import {Dropdown} from 'react-bootstrap';

import DataHelper from 'servicesDir/data-helper';

export default class LiveEditNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {sites: []};
  }

  componentDidMount() {
    ApiCall.get('site').then(result => {
      this.setState({sites: DataHelper.mapCollectionData(result.data)});
    })
  }

  render() {
    return (
    <Dropdown id="live-edit-sites" className="live-edit-dropdown" >
      <Dropdown.Toggle className="live-edit-toggle" >
        <div className="live-edit-dropdown-content"><i className="fas fa-draw-polygon" /> Live edit <i className="material-icons arrow-icon">keyboard_arrow_down</i></div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="super-colors">
        {this.state.sites.map((site, index) => {
          return  <Dropdown.Item key={index} onClick={() => this.openLiveEditPage(site)}>{site.name}</Dropdown.Item>
        })}
      </Dropdown.Menu>
    </Dropdown>
    );
  }

  openLiveEditPage(site) {
    let nemesisToken = document.getElementById('token').getAttribute('value');
    let siteUrl = document.getElementById('website-base-url').getAttribute('url');
    let restUrl = document.getElementById('rest-base-url').getAttribute('url');
    let url = `${siteUrl}?site=${site.code}&live_edit_view=true&token=${nemesisToken}&restUrl=${restUrl}`;

    window.open(url, '_blank')
  }
}
