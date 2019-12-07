import React, { Component } from 'react';

import Translate from 'react-translate-component';

import ApiCall from 'servicesDir/api-call';

import DataHelper from 'servicesDir/data-helper';

import {Dropdown} from 'react-bootstrap';

export default class MirrorButton extends Component {
  constructor(props) {
    super(props);
    this.state = {syncStates: []}
  }

  componentDidMount() {
    console.log(this.props)
    ApiCall.get(this.props.mirrorLink).then(result => {
      this.setState({syncStates: DataHelper.mapCollectionData(result.data)});
    }, err => {
      //nothing
    });
  }

  render() {
    if (this.state.syncStates.length === 0) {
      return false;
    }

    if (this.state.syncStates.length === 1) {
      return (
        <div className={'functional-button nemesis-button synchronize-button'} onClick={() => {
          this.props.onMirrorEntityClick(this.props.isOnline ? this.state.syncStates[0].sourceId : this.state.syncStates[0].targetId)
        }}>
          <Translate component="span" content={'main.Mirror Entity'} fallback={'Mirror Entity'}/>
        </div>
      )
    }

    return (
      <Dropdown id="live-edit-sites" className="mirror-button-dropdown">
        <Dropdown.Toggle className="mirror-button-toggle">
          <div className="mirror-button-dropdown-content"><Translate component="span" content={'main.Mirror Entity'} fallback={'Mirror Entity'}/><i className="material-icons arrow-icon">keyboard_arrow_down</i></div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.state.syncStates.map((state, index) => {
            return  <Dropdown.Item key={index} onClick={() => this.props.onMirrorEntityClick(this.props.isOnline ? state.sourceId : state.targetId)}>{this.props.isOnline ? state.sourceId : state.targetId}</Dropdown.Item>
          })}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}
