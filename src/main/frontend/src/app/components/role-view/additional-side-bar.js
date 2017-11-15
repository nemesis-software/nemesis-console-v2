import React, {Component} from 'react';

import _ from 'lodash';

export default class AdditionalSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedGroup: null};
  }

  render() {
    return (
      <div className={'additional-sidebar' + (this.props.isSidebarOpened ? ' opened' : '')}>
        <button onClick={() => {
          this.props.closeSidebar();
          this.setSelectedGroup(null);
        }}>Close Sidebar</button>
        <button onClick={() => this.setSelectedGroup(null)}>Back to groups</button>
        <div className="groups-container" style={this.getGroupContainerStyle()}>
          {_.map(this.props.sideBar, (item, key) => {
            return <div key={key} onClick={() => this.setSelectedGroup(item.groupName)}>{item.groupName}</div>
          })}
        </div>
        <div className="selected-group" style={this.getSelectedGroupStyle()}>
          {_.map(this.props.sideBar, (item, key) => {
            return <div key={key} style={this.getChoosenGroupStyle(item.groupName)}>
              {item.groupName}
              {_.map(item.items, (item, key) => {
                return <div key={key}>{this.props.getSectionItemRenderer(item, key)}</div>
              })}
            </div>
          })}
        </div>
      </div>
    )
  }

  getGroupContainerStyle() {
    let style = {};

    if (this.state.selectedGroup) {
      style.display = 'none'
    }

    return style;
  }

  getSelectedGroupStyle() {
    let style = {};

    if (!this.state.selectedGroup) {
      style.display = 'none'
    }

    return style;
  }

  getChoosenGroupStyle(groupName) {
    let style = {};

    if (this.state.selectedGroup !== groupName) {
      style.display = 'none'
    }

    return style;
  }

  setSelectedGroup(selectedGroup) {
    this.setState({...this.state, selectedGroup: selectedGroup})
  }
}