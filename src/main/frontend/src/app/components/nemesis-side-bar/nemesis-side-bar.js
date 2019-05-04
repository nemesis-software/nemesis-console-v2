import React, {Component} from 'react';

import {Link} from 'react-router-dom';

import _ from 'lodash';

export default class NemesisSideBar extends Component {
  constructor(props) {
    super(props);
    this.isAdmin = document.getElementById('authorities').getAttribute('value').indexOf('ROLE_ADMINGROUP') > -1;
  }

  render() {
    const pathName = this.props.routerProps.location.pathname;
    return (
      <div className="nemesis-side-bar">
        <Link to="/pos">
          <div title="Point of sale" className={"nemesis-side-bar-item" + (pathName === "/pos" ? " selected" : "")}><i className="fa fa-shopping-basket nemesis-side-bar-icon"></i></div>
        </Link>
        {_.map(_.keys(this.props.sidebarData), item => {
          return (
            <Link to={`/${item}`} key={item}>
            <div title={item} className={"nemesis-side-bar-item"+ (pathName === `/${item}` ? " selected" : "")}><i className={"nemesis-side-bar-icon fa " + this.getIcon(item)}></i></div>
          </Link>
          )
        })}
        <Link to="/">
          <div title="Admin" className={"nemesis-side-bar-item" + (pathName === "/" ? " selected" : "")}><i className="fa fa-chart-bar nemesis-side-bar-icon"></i></div>
        </Link>
        {this.isAdmin ?
          <Link to="/maintenance">
            <div title="Maintenance" className={"nemesis-side-bar-item" + (pathName === "/maintenance" ? " selected" : "")}><i className="fa fa-file-code nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
        {this.isAdmin ?
          <Link to="/console-configuration">
            <div title="Console configuration" className={"nemesis-side-bar-item"+ (pathName === "/console-configuration" ? " selected" : "")}><i className="fa fa-cog nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
      </div>
    );
  }

  getIcon(item) {
    switch (item) {
      case 'content': return 'fa-columns';
      case 'product': return 'fa-box';
      case 'shop': return 'fa-shopping-basket';
      case 'customer': return 'fa-users';
      default: return 'fa-folder'
    }
  }
}
