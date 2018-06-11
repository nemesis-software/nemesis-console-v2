import React, { Component } from 'react';

import Translate from 'react-translate-component';

import ApiCall from 'servicesDir/api-call';

import DataHelper from 'servicesDir/data-helper';

import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import EntityComparePopup from "../../../../custom-components/entity-compare-popup/entity-compare-popup";

export default class DiffButton extends Component {
  constructor(props) {
    super(props);
    this.state = {syncStates: [], isModalOpened: false, firstEntityId: null, secondEntityId: null}
  }

  componentWillMount() {
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

    return (
      <React.Fragment>
        {this.state.syncStates.length === 1 ?
          <div className={'functional-button nemesis-button synchronize-button'} onClick={() => {
            this.onItemSelection(this.state.syncStates[0].sourceId, this.state.syncStates[0].targetId)
          }}>
            <Translate component="span" content={'main.Diff Entity'} fallback={'Diff Entity'}/>
          </div>
          :
          <Dropdown id="live-edit-sites" className="mirror-button-dropdown">
            <Dropdown.Toggle className="mirror-button-toggle" noCaret>
              <div className="mirror-button-dropdown-content"><Translate component="span" content={'main.Diff Entity'} fallback={'Diff Entity'}/><i className="material-icons arrow-icon">keyboard_arrow_down</i></div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {this.state.syncStates.map((state, index) => {
                return  <MenuItem key={index} onClick={() => this.onItemSelection(state.sourceId,state.targetId)}>{this.props.isOnline ? state.sourceId : state.targetId}</MenuItem>
              })}
            </Dropdown.Menu>
          </Dropdown>
        }
        {this.state.isModalOpened ? <EntityComparePopup openModal={this.state.isModalOpened}
                                                        onModalClose={() => this.setState({isModalOpened: false})}
                                                        entityName={this.props.entityName}
                                                        firstItemId={this.state.firstEntityId}
                                                        secondItemId={this.state.secondEntityId}/> : false}
      </React.Fragment>
    )
  }

  onItemSelection(sourceId, targetId) {
    this.setState({isModalOpened: true, firstEntityId: sourceId, secondEntityId: targetId});
  }
}
