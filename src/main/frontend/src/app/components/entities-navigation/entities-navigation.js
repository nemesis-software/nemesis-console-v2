import React, { Component } from 'react';

import Nav from 'react-bootstrap/lib/Nav';

import _ from 'lodash';

import { componentRequire } from '../../utils/require-util';

let EntitiesNavigationItem = componentRequire('app/components/entities-navigation/entity-navigation-item', 'entity-navigation-item');

export default class EntitiesNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {groupedEntities: []};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({groupedEntities: this.getGroupedEntities(nextProps.entities)});
  }

  render() {
    return (
      <Nav bsStyle="pills" className="nav nav-pills">
        {_.map(this.state.groupedEntities, (value, key) =>
          <EntitiesNavigationItem key={key} entityId={key}
                                  entities={value.reverse()}
                                  onEntityWindowClose={this.props.onEntityWindowClose}
                                  onNavigationItemClick={this.props.onNavigationItemClick}/>
        )}
      </Nav>
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
}
