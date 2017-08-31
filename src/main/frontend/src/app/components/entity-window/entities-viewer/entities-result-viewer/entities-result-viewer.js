import React, { Component } from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';

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
          <Select style={{width: '265px'}}
                  clearable={false}
                  disabled={this.props.readOnly}
                  value={{value: this.state.selectedMenuIndex, label: this.getViewers()[this.state.selectedMenuIndex].viewerName}}
                  onChange={this.handleViewerChange.bind(this)}
                  options={this.getViewers().map((item, index) => {
                    return {value: index, label: item.viewerName}
                  })}/>
        </div>
        {this.getViewers().map(this.getViewerElement.bind(this))}
      </div>
    )
  }

  handleViewerChange(item) {
    this.setState({...this.state, selectedMenuIndex: item.value});
  }

  getViewerSelectStyle() {
    let style = {display:'inline-block', marginBottom: '20px'};
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
      onSortDataChange: this.props.onSortDataChange,
      sortData: this.props.sortData,
      page: this.props.page,
      onEntityItemClick: this.props.onEntityItemClick,
      key: index,
      style: index === this.state.selectedMenuIndex ? {} : {display: 'none'}
    };

    return React.createElement(viewer.viewerClass, config);
  }
}