import React, { Component } from 'react';
import { componentRequire } from '../../../utils/require-util';
import EntitiesResultViewer from './entities-result-viewer/entities-result-viewer';
import EntitiesFilter from './entities-filter/entities-filter';
import Translate from 'react-translate-component';
import ApiCall from '../../../services/api-call';
import _ from 'lodash';

const pagerData = {
  page: 1,
  pageSize: 20
};

export default class EntitiesViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {searchData: [], page: {}, filter: null};
  }

  componentWillMount() {
    this.getEntitiesData(this.props.entity, pagerData.page, pagerData.pageSize, this.state.filter);
  }

  render() {
    return (
      <div>
        <Translate component="h2" content={'main.' + this.props.entity.entityId} fallback={this.props.entity.entityId}/>
        <EntitiesFilter filterMarkup={this.props.entity.data.filter} onFilterApply={this.onFilterApply.bind(this)}/>
        <EntitiesResultViewer entities={this.state.searchData}
                        entitiesMarkup={this.props.entity.data.result}
                        onPagerChange={this.onPagerChange.bind(this)}
                        page={this.state.page}
                        onEntityItemClick={this.onEntityItemClick.bind(this)}/>
      </div>
    )
  }

  onFilterApply(filter) {
    this.setState({...this.state, filter: filter});
    this.getEntitiesData(this.props.entity, pagerData.page, this.state.page.size, filter);
  }

  getEntitiesData(entity, page, pageSize, filter) {
    ApiCall.get(entity.entityId, {page: page, size: pageSize, $filter: filter, projection: 'search'}).then(result => {
      this.setState({...this.state, searchData: this.mapCollectionData(result.data), page: result.data.page});
    });
  }

  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  onEntityItemClick(item) {
    this.props.onEntityItemClick(item, this.props.entity.entityId)
  }

  retakeEntityData() {
    this.getEntitiesData(this.props.entity, this.state.page.number + 1, this.state.page.size, this.state.filter);
  }

  onPagerChange(page, pageSize) {
    this.getEntitiesData(this.props.entity, page, pageSize, this.state.filter);
  }
}