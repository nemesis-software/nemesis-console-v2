import React, { Component } from 'react';
import { componentRequire } from '../../../../utils/require-util';
import Paper from 'material-ui/Paper';
import EntitiesTableViewer from '../entities-table-viewer/entities-table-viewer';

export default class EntitiesResultViewer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Paper zDepth={1} style={{margin: '5px', padding: '5px', marginTop: '20px'}}>
        <EntitiesTableViewer entities={this.props.entities}
                             entitiesMarkup={this.props.entitiesMarkup}
                             onPagerChange={this.props.onPagerChange}
                             page={this.props.page}
                             onEntityItemClick={this.props.onEntityItemClick}/>
      </Paper>
    )
  }
}