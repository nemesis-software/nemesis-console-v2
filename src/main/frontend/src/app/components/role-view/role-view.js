import React, {Component} from 'react';

import ApiCall from '../../services/api-call'
import {componentRequire} from '../../utils/require-util'

import _ from 'lodash';

import RoleViewItem from './role-view-item';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

import Translate from 'react-translate-component';

export default class RoleView extends Component {
  constructor(props) {
    super(props);
    this.state = {markupData: [], entityMarkupData: [], isItemSelected: false, selectedItemData: {}};
  }

  componentWillMount() {
    return Promise.all([ApiCall.get('markup/search/all'), ApiCall.get('markup/entity/all'), ApiCall.get('site')]).then(result => {
      console.log(result[1].data);
      console.log(result[0].data);
      this.setState({...this.state, markupData: result[0].data, entityMarkupData: result[1].data, sites: this.mapCollectionData(result[2].data)});
    })
  }

  render() {
    return (
      <div>
        <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
        <div className="role-view">
          {!this.state.isItemSelected ? this.props.allowedViews.map(item => {
            return (
              <div className="role-view-item-selector" key={item} onClick={() => {this.openRoleViewItem(item)}}>
                <Translate component="div" content={'main.' + item} fallback={item}/>
                <div>{this.getItemIcon(item)}</div>
              </div>
            )
          }) : false}
          {
            this.state.isItemSelected ?
              <RoleViewItem item={this.state.selectedItem}
                            sites={this.state.sites}
                            entityMarkupData={this.state.entityMarkupData}
                            markupData={this.state.markupData}/>
              : false
          }
        </div>
      </div>
    )
  }

  getItemIcon(item) {
    switch (item) {
      case 'blog_entry':
        return <i className="fa fa-address-card-o role-view-item-selector-icon"/>;
      case 'widget':
        return <i className="fa fa-cog role-view-item-selector-icon"/>;
      default:
        return false;
    }
  }

  openRoleViewItem(item) {
    this.setState({...this.state, selectedItem: item, isItemSelected: true});
  }


  mapCollectionData(data) {
    let result = [];
    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

}