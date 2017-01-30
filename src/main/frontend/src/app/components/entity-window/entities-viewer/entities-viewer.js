import React, { Component } from 'react';
import { componentRequire } from '../../../utils/require-util';
import EntitiesTableViewer from './entities-table-viewer/entities-table-viewer';

export default class EntitiesViewer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <EntitiesTableViewer entities={this.props.entities}
                           entitiesMarkup={this.props.entitiesMarkup}
                           onPagerChange={this.props.onPagerChange}
                           page={this.props.page}
                           onEntityItemClick={this.props.onEntityItemClick}/>
    )
  }
}