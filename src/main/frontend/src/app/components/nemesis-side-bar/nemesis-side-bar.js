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
        {_.map(_.keys(this.props.sidebarData), item => {
          return (
            <Link to={`/${item}`} key={item}>
                <div title={item} className={"nemesis-side-bar-item"+ (pathName.startsWith(`/${item}`) ? " selected" : "")}><i className={"nemesis-side-bar-icon fa " + this.getIcon(item)}></i></div>
            </Link>
          )
        })}
      </div>
    );
  }

  getIcon(item) {
    switch (item) {
      case 'admin': return 'fa-chart-bar';
      case 'content': return 'fa-columns';
      case 'product': return 'fa-box';
      case 'shop': return 'fa-shopping-basket';
      case 'customer': return 'fa-users';
      case 'pos': return 'fa-shopping-basket';
      case 'theme': return 'fa-palette';
      case 'taxonomy': return 'fa-project-diagram';
      case 'kie': return 'fa-lightbulb';
      case 'bpmn': return 'fa-chalkboard-teacher';
      case 'dmn': return 'fa-table';
      case 'brm': return 'fa-ruler';
      case 'search': return 'fa-search';
      case 'maintenance': return 'fa-file-code';
      case 'console-configuration': return 'fa-cog';

      default: return 'fa-folder'
    }
  }
}
