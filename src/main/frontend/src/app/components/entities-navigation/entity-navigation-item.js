import React, { Component } from 'react';
import Translate from 'react-translate-component';
import _ from 'lodash';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {entitySearchType, entityItemType, entityCreateType} from '../../types/entity-types'

export default class EntitiesNavigationItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  onNestedItemTouchTab = (event, entity) => {
    if (event.target.className.indexOf('close-icon') > -1) {
      this.props.onEntityWindowClose(entity);
      return;
    }
    this.setState({
      open: false,
    });

    this.props.onNavigationItemClick(entity);
  };

  render() {
    return (
      <NavDropdown id={this.props.entityId} className={'' + (_.some(this.props.entities, {isVisible: true}) ? ' active' : '')} title={<Translate content={'main.' + this.props.entityId} fallback={this.props.entityId}/>}>
        {this.getFilteredSubEntities().map((subEntity, index) => {
          return <MenuItem onClick={(event) => this.onNestedItemTouchTab(event, subEntity)} key={index}><a>{this.getMenuItemContentByEntityType(subEntity)}</a></MenuItem>;
        })}
      </NavDropdown>
    )
  }

  getMenuItemContentByEntityType(entity) {
    let text = entity.entityCode;
    let type = entity.type;
    if (type === entitySearchType) {
      text = 'Entity Search';
    }

    if (type === entityItemType) {
      text = `${entity.entityCode} - ${entity.itemId}` ;
    }

    if (type === entityCreateType) {
      text = entity.itemId + ' - Create Entity';
    }

    return <div><span className={entity.isVisible ? 'selected-navigation-menu-item' : ''}>{text}</span><i style={{marginLeft: '15px', verticalAlign: 'middle'}} className="material-icons close-icon">close</i></div>
  }

  getFilteredSubEntities() {
    let result = [];
    let groupedEntities = _.groupBy(this.props.entities, 'type');
    if (groupedEntities[entitySearchType]) {
      result = result.concat(groupedEntities[entitySearchType]);
      delete groupedEntities[entitySearchType];
    }

    if (groupedEntities[entityCreateType]) {
      result = result.concat(_.orderBy(groupedEntities[entityCreateType], 'itemId'));
      delete groupedEntities[entityCreateType];
    }

    if (groupedEntities[entityItemType]) {
      result = result.concat(_.orderBy(groupedEntities[entityItemType], 'entityCode'));
      delete groupedEntities[entityItemType];
    }

    _.forIn(groupedEntities, (value, key) => result = result.concat(value));

    return result;
  }
}