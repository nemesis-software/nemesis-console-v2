import React, { Component } from 'react';
import EntitiesNavigationItem from './entity-navigation-item'
import { componentRequire } from '../../utils/require-util';



export default class EntitiesNavigation extends Component {
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
      <div>
        {this.props.entities.map((entity, index) => <EntitiesNavigationItem key={index} entity={entity}/> )}
      </div>
    )
  }
}
