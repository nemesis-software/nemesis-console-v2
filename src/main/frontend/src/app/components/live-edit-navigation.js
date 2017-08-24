import React, { Component } from 'react';

import ApiCall from '../services/api-call';

import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

export default class LiveEditNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {sites: []};
  }

  componentWillMount() {
    ApiCall.get('site').then(result => {
      this.setState({sites: this.mapCollectionData(result.data)});
    })
  }

  render() {
    return (
    <Dropdown id="live-edit-sites" className="live-edit-dropdown">
      <Dropdown.Toggle className="live-edit-toggle" noCaret>
        <div className="live-edit-dropdown-content"><i className="fa fa-globe" /> Live edit <i className="material-icons arrow-icon">keyboard_arrow_down</i></div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="super-colors">
        {this.state.sites.map((site, index) => {
          return  <MenuItem key={index} onClick={() => this.openLiveEditPage(site)}>{site.name}</MenuItem>
        })}
      </Dropdown.Menu>
    </Dropdown>
    );
  }

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  openLiveEditPage(site) {
    let nemesisToken = document.getElementById('token').getAttribute('value');
    let siteUrl = document.getElementById('website-base-url').getAttribute('url');
    let restUrl = document.getElementById('rest-base-url').getAttribute('url');
    let url = `${siteUrl}?site=${site.code}&live_edit_view=true&token=${nemesisToken}&restUrl=${restUrl}`;

    window.open(url, '_blank')
  }
}