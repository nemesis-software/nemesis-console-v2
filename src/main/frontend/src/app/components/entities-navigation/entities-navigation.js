import React, { Component } from 'react';

import Nav from 'react-bootstrap/lib/Nav';

import _ from 'lodash';

import { componentRequire } from '../../utils/require-util';

import ReactDOM from 'react-dom'

let EntitiesNavigationItem = componentRequire('app/components/entities-navigation/entity-navigation-item', 'entity-navigation-item');

export default class EntitiesNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {groupedEntities: [], containerHeight: '44'};
    this.navRef = null;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...this.state, groupedEntities: this.getGroupedEntities(nextProps.entities)});
  }

  componentDidUpdate() {
    if (this.navRef) {
      let domNode = ReactDOM.findDOMNode(this.navRef);
      let nodeHeight = domNode.clientHeight;
      if (this.state.containerHeight !== nodeHeight) {
        this.setState({...this.state, containerHeight: nodeHeight});
      }
    }
  }

  render() {
    return (
      <div style={this.getContainerStyle()}>
        <Nav ref={el => this.navRef = el} bsStyle="pills" className="nav nav-pills entity-navigation">
          {_.map(this.state.groupedEntities, (value, key) =>
            <EntitiesNavigationItem key={key} entityId={key}
                                    entities={value.reverse()}
                                    onEntityWindowClose={this.props.onEntityWindowClose}
                                    onNavigationItemClick={this.props.onNavigationItemClick}/>
          )}
        </Nav>
      </div>
    )
  }

  getGroupedEntities(entities) {
    let groupedEntities = _.groupBy(entities, 'entityId');

    const keys = Object.keys(groupedEntities);
    const sortedKeys = _.sortBy(keys);

    return _.fromPairs(
      _.map(sortedKeys, key => [key, groupedEntities[key]])
    )
  }

  getContainerStyle() {
    let style = {
      width: '100%',
      height: this.state.containerHeight + 'px'
    };

    return style;
  }
}
