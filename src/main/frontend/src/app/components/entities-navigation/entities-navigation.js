import React, { Component } from 'react';
import EntitiesNavigationItem from './entity-navigation-item'
import { componentRequire } from '../../utils/require-util';
import {GridList, GridTile} from 'material-ui/GridList';
import _ from 'lodash';

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
      <GridList className="entity-navigation" cellHeight="auto" cols={2.2}>
        {_.map(this.state.groupedEntities, (value, key) =>
          <GridTile className="navigation-item-container" style={{width: 'auto'}} containerElement="span" key={key}>
            <EntitiesNavigationItem entityId={key}
                                    entities={value.reverse()}
                                    onEntityWindowClose={this.props.onEntityWindowClose}
                                    onNavigationItemClick={this.props.onNavigationItemClick}/>
          </GridTile>
        )}
      </GridList>
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
