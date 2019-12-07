import React, { Component } from 'react';
import Translate from 'react-translate-component';
import _ from 'lodash';
import {NavDropdown} from 'react-bootstrap';
import {DropdownItem} from 'react-bootstrap';

import {entitySearchType, entityItemType, entityCreateType, entityCloneType, entityBulkEdit} from '../../types/entity-types'

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
      <NavDropdown id={this.props.entityId} className={'entity-nav-dropdown' + (_.some(this.props.entities, {isVisible: true}) ? ' selected' : '')} title={this.getDropdownTitle()}>
        {this.getFilteredSubEntities().map((subEntity, index) => {
          return <DropdownItem onClick={(event) => this.onNestedItemTouchTab(event, subEntity)} key={index}>{this.getMenuItemContentByEntityType(subEntity)}</DropdownItem>;
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

    if (type === entityCreateType || type === entityCloneType) {
      text = `${entity.itemId} - ${entity.entityName} - Create Entity`;
    }

    if (type === entityBulkEdit) {
      text = `${entity.itemId} - ${entity.entityName} - Bulk edit`;
    }

    return <div><span className={entity.isVisible ? 'selected-navigation-menu-item' : ''}>{text}</span><i className="material-icons close-icon">close</i></div>
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

  getDropdownTitle() {
    return <div className="dropdown-title-container"><Translate content={'main.' + this.props.entityId} fallback={this.props.entityId}/> <i className="material-icons dropdown-caret-icon">keyboard_arrow_down</i></div>
  }
}