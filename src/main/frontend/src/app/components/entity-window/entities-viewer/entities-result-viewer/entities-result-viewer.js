import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { componentRequire } from '../../../../utils/require-util';
let EntitiesTableViewer = componentRequire('app/components/entity-window/entities-viewer/entities-table-viewer/entities-table-viewer', 'entities-table-viewer');

export default class EntitiesResultViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedMenuIndex: 0};

  }

  render() {
    return (
      <Paper zDepth={1} style={{margin: '5px', padding: '5px', marginTop: '20px'}}>
        <div style={this.getViewerSelectStyle()}>
          <SelectField
            floatingLabelText="Viewer"
            value={this.state.selectedMenuIndex}
            onChange={this.handleViewerChange.bind(this)}
          >
            {this.getViewers().map((item, index) => {
              return  <MenuItem key={index} value={index} primaryText={item.viewerName} />
            })}
          </SelectField>
        </div>
        {this.getViewers().map(this.getViewerElement.bind(this))}
      </Paper>
    )
  }

  handleViewerChange(event, index) {
    this.setState({...this.state, selectedMenuIndex: index});
  }

  getViewerSelectStyle() {
    let style = {};
    if (this.getViewers().length <= 1) {
      style = {display: 'none'};
    }

    return style;
  }

  getViewers() {
    return [{viewerName: 'Default viewer', viewerClass: EntitiesTableViewer}];
  }

  getViewerElement(viewer, index) {
    let config = {
      entities: this.props.entities,
      entitiesMarkup: this.props.entitiesMarkup,
      onPagerChange: this.props.onPagerChange,
      page: this.props.page,
      onEntityItemClick: this.props.onEntityItemClick,
      key: index,
      style: index === this.state.selectedMenuIndex ? {} : {display: 'none'}
    };

    return React.createElement(viewer.viewerClass, config);
  }
}