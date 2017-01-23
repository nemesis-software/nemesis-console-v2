import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Translate from 'react-translate-component';

const entitySearchType = 'SEARCH';

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

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <span>
               <RaisedButton
                 style={{margin: '5px'}}
                 onTouchTap={this.handleTouchTap}
                 children={
                   <Translate style={{padding: '5px'}}
                              component="span"
                              content={'main.' + this.props.entity.entityId}
                              fallback={this.props.entity.entityId}/>
                 }
               />
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
                animation={PopoverAnimationVertical}>
                <Menu>
                  {this.props.entity.subEntities.map((subEntity, index) => {
                    if (subEntity.type === entitySearchType) {
                      return (
                        <MenuItem key={index} primaryText="Entity Search" />
                      )
                    } else {
                      return <MenuItem key={index} primaryText="Not implemented" />
                    }
                  })}
                </Menu>
              </Popover>
            </span>
    )
  }
}