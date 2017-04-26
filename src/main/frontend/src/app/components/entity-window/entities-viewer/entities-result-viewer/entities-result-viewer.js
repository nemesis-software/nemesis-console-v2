import React, { Component } from 'react';

import Translate from 'react-translate-component';

import { componentRequire } from '../../../../utils/require-util';
let EntitiesTableViewer = componentRequire('app/components/entity-window/entities-viewer/entities-table-viewer/entities-table-viewer', 'entities-table-viewer');

export default class EntitiesResultViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedMenuIndex: 0};
  }

  render() {
    return (
      <div className="paper-box" style={{margin: '5px', padding: '5px', marginTop: '20px'}}>
        <div style={this.getViewerSelectStyle()}>
          <label><Translate content={'main.viewer'} fallback={'Viewer'}/></label>
          <select style={{width: '265px'}} className="form-control" onChange={this.handleViewerChange.bind(this)} disabled={this.props.readOnly}>
            {this.getViewers().map((item, index) =><option key={index} value={index}>{item.viewerName}</option>)}
          </select>
        </div>
        {this.getViewers().map(this.getViewerElement.bind(this))}
      </div>
    )
  }

  handleViewerChange(event) {
    this.setState({...this.state, selectedMenuIndex: event.target.selectedIndex});
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