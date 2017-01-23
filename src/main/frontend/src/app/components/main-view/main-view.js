import React, { Component } from 'react';
import ApiCall from '../../services/api-call'
import _ from 'lodash';
import EntitiesNavigation from '../entities-navigation/entities-navigation'
import { componentRequire } from '../../utils/require-util';

const styles = {
  paddingLeft: '300px',
  paddingTop: '68px'
};

const entitySearchType = 'SEARCH';

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {markupData: [], selectedEntity: null, openedEntities: []};
  }

  componentWillMount() {
    ApiCall.get('markup/search/all').then(result => {
      this.setState({...this.state, markupData: result.data});
      console.log(this.state);
    });
  }

  componentWillReceiveProps(nextProps) {
    let selectedEntity = {
      entityId: nextProps.selectedEntityId,
      data: this.state.markupData[nextProps.selectedEntityId],
      type: entitySearchType
    };

    let newEntity = null;

    if (_.findIndex(this.state.openedEntities, {entityId: nextProps.selectedEntityId}) < 0) {
      newEntity = {entityId: nextProps.selectedEntityId, subEntities: [selectedEntity]};
    }

    this.setState({
        ...this.state,
        selectedEntity: selectedEntity,
        openedEntities: !!newEntity ? this.state.openedEntities.concat([newEntity]) : this.state.openedEntities
      });
  }

  render() {
    console.log(this.state);
    return (
      <div style={styles}>
        <EntitiesNavigation entities={this.state.openedEntities} />
      </div>
    )
  }
}