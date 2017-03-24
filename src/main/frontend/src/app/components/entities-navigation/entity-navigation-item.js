import React, { Component } from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import TouchRipple from 'material-ui/internal/TouchRipple'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Translate from 'react-translate-component';
import _ from 'lodash';

import {entitySearchType, entityItemType, entityCreateType} from '../../types/entity-types'

export default class EntitiesNavigationItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

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

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <span>
        <TouchRipple>
          <Translate style={{padding: '5px', textAlign: 'center'}}
                     component="div"
                     className={'entity-navigation-item' + (_.some(this.props.entities, {isVisible: true}) ? ' selected' : '')}
                     onTouchTap={this.handleTouchTap}
                     content={'main.' + this.props.entityId}
                     fallback={this.props.entityId}/>
        </TouchRipple>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'middle', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}>
          <Menu>
            {this.getFilteredSubEntities().map((subEntity, index) => {
              return <MenuItem onTouchTap={(event) => this.onNestedItemTouchTab(event, subEntity)} key={index} primaryText={this.getMenuItemContentByEntityType(subEntity)} />
            })}
          </Menu>
        </Popover>
      </span>
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