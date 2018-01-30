import React, {Component} from 'react';

import _ from 'lodash';

import {nemesisFieldTypes} from '../../types/nemesis-types';

export default class AdditionalSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedGroup: null};
  }

  render() {
    return (
      <div className={'additional-sidebar-container' + (this.props.isSidebarOpened ? ' opened' : '')}>
        <div className={'additional-sidebar'}>
          {/*<button onClick={() => {*/}
            {/*this.props.closeSidebar();*/}
            {/*this.setSelectedGroup(null);*/}
          {/*}}>Close Sidebar*/}
          {/*</button>*/}
          {this.state.selectedGroup ? <div className="back-to-group-button" title="back to groups" onClick={() => this.setSelectedGroup(null)}><i className="material-icons">arrow_back</i></div> : false}
          <div className="groups-container" style={this.getGroupContainerStyle()}>
            {_.map(this.props.sideBar, (item, key) => {
              return <div className="group-item-button nemesis-button success-button" key={key} onClick={() => this.setSelectedGroup(item.groupName)}>{item.groupName}</div>
            })}
          </div>
          <div className="selected-group" style={this.getSelectedGroupStyle()}>
            {_.map(this.props.sideBar, (item, key) => {
              return <div key={key} style={this.getChoosenGroupStyle(item.groupName)}>
                <div className="group-name-container">{item.groupName}</div>
                {_.map(item.items, (item, key) => {
                  return <div className={'paper-box with-hover nemesis-field-container' + this.getFieldStyle(item)}
                              key={key}>{this.props.getSectionItemRenderer(item, key)}</div>
                })}
              </div>
            })}
          </div>
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

  getFieldStyle(item) {
    if (item.embeddedCreation || item.field.xtype === nemesisFieldTypes.nemesisMapField) {
      return ' with-icon';
    }

    return '';
  }
}