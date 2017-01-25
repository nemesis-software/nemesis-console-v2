import React, {Component} from 'react';
import {entitySearchType, entityItemType} from '../../types/entity-types'
import ApiCall from '../../services/api-call';
import _ from 'lodash';

export default class EntitiesWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {searchResult: [], itemResult: {}};
  }

  componentWillMount() {
    this.getDataByEntityType(this.props.entity);
  }

  render() {
    let styles = {};
    if (!this.props.entity.isVisible) {
      styles.display = 'none';
    }

    return (
      <div style={styles}>
        {this.renderEntityByType(this.props.entity)}
      </div>
    )
  }

  renderEntityByType(entity) {
    switch (entity.type) {
      case entityItemType: {
        return (
          <div>{entity.entityId}</div>
        );
      }
      case entitySearchType: {
        return (
          <div>
            {entity.entityId}
            {this.state.searchResult.map((item, index) => <div onClick={() => {this.props.onEntityItemClick(item, entity.entityId)}} key={index}>{item.id}</div>)}
          </div>
        );
      }
      default: {
        return <div>INVALID ENTITY TYPE!!!</div>
      }
    }
  }

  getDataByEntityType(entity) {
    switch (entity.type) {
      case entityItemType: {
        ApiCall.get(entity.entityId + '/' + entity.itemId);
        return;
      }
      case entitySearchType: {
        ApiCall.get(entity.entityId).then(result => {
          let data = [];
          _.forIn(result.data._embedded, (value) => data = data.concat(value));
          this.setState({...this.state, searchResult: data});
          console.log(data);
        });
        return;
      }
      default: {
        throw 'INVALID ENTITY TYPE!!!';
      }
    }
  }
}
