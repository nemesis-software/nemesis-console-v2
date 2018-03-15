import React, {Component} from 'react';

import {Link} from 'react-router-dom';

import _ from 'lodash';

export default class NemesisSideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="nemesis-side-bar">
        <Link to="/pos">
          <div title="Point of sale" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">add_to_queue</i></div>
        </Link>
        {_.map(_.keys(this.props.sidebarData), item => {
          return (
            <Link to={`/${item}`} key={item}>
            <div title={item} className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">{this.getIcon(item)}</i></div>
          </Link>
          )
        })}
        <Link to="/maintenance">
          <div title="Maintenance" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">settings_remote</i></div>
        </Link>
        <Link to="/">
          <div title="Admin" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">settings</i></div>
        </Link>
        <Link to="/console-configuration">
          <div title="Console configuration" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">build</i></div>
        </Link>
      </div>
    );
  }

  getIcon(item) {
    switch (item) {
      case 'content': return 'web';
      case 'product': return 'toys';
      case 'shop': return 'shopping_cart';
      case 'customer': return 'person';
      default: return 'folder'
    }
  }

}