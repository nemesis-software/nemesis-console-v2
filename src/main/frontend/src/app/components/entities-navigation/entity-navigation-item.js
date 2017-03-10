import React, { Component } from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import TouchRipple from 'material-ui/internal/TouchRipple'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Translate from 'react-translate-component';

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
            {this.props.entities.map((subEntity, index) => {
              return <MenuItem onTouchTap={(event) => this.onNestedItemTouchTab(event, subEntity)} key={index} primaryText={this.getMenuItemContentByEntityType(subEntity)} />
            })}
          </Menu>
        </Popover>
      </span>
    )
  }

  getMenuItemContentByEntityType(entity) {
    let text = '';
    let type = entity.type;
    if (type === entitySearchType) {
      text = 'Entity Search';
    }

    if (type === entityItemType) {
      text = entity.itemId + ' - ' + entity.entityId;
    }

    if (type === entityCreateType) {
      text = entity.itemId + ' - Create Entity';
    }

    return <div><span>{text}</span><i style={{marginLeft: '15px', verticalAlign: 'middle'}} className="material-icons close-icon">close</i></div>
  }
}