import React, {Component} from 'react';

import ApiCall from '../../services/api-call';
import DataHelper from 'servicesDir/data-helper';

import {componentRequire} from '../../utils/require-util'

import SimpleViewItem from './simple-view-item';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

import Translate from 'react-translate-component';

export default class SimpleView extends Component {
  constructor(props) {
    super(props);
    this.state = {markupData: [], entityMarkupData: [], isItemSelected: false, selectedItemData: {}};
  }

  componentWillMount() {
    return Promise.all([ ApiCall.get('site')]).then(result => {
      this.setState({sites: DataHelper.mapCollectionData(result[0].data)});
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.timestamp !== nextProps.timestamp) {
      this.setState({isItemSelected: false});
    }
  }

  render() {
    return (
      <div key={this.props.timestamp}>
        <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
        <div className="simple-view">
          {!this.state.isItemSelected ? this.props.allowedViews.map(item => {
            return (
              <div className="simple-view-item-selector" key={item} onClick={() => {this.openSimpleViewItem(item)}}>
                <Translate component="div" content={'main.' + item} fallback={item}/>
                <div>{this.getItemIcon(item)}</div>
              </div>
            )
          }) : false}
          {
            this.state.isItemSelected ?
              <SimpleViewItem item={this.state.selectedItem}
                            sites={this.state.sites}/>
              : false
          }
        </div>
      </div>
    )
  }

  getItemIcon(item) {
    switch (item) {
      case 'blog_entry':
        return <i className="fa fa-address-card-o simple-view-item-selector-icon"/>;
      case 'widget':
        return <i className="fa fa-cog simple-view-item-selector-icon"/>;
      default:
        return false;
    }
  }

  openSimpleViewItem(item) {
    this.setState({...this.state, selectedItem: item, isItemSelected: true});
  }
}