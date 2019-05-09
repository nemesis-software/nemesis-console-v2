import React, {Component} from 'react';

import ApiCall from '../../services/api-call';
import DataHelper from 'servicesDir/data-helper';

import {componentRequire} from '../../utils/require-util'

import SimpleViewItem from './simple-view-item';

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

import NotificationSystem from 'react-notification-system';

import Translate from 'react-translate-component';

export default class SimpleView extends Component {
  constructor(props) {
    super(props);
    this.state = {markupData: [], entityMarkupData: [], isItemSelected: false, selectedItemData: {}};
    this.notificationSystem = null;
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
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
                <i className={"fa " + this.getIcon(item)}></i>
                <Translate component="div" content={'main.' + item} fallback={item}/>
              </div>
            )
          }) : false}
          {
            this.state.isItemSelected ?
              <SimpleViewItem item={this.state.selectedItem}
                              openNotificationSnackbar={this.openNotificationSnackbar.bind(this)}
                              sites={this.state.sites}/>
              : false
          }
        </div>
        <NotificationSystem ref="notificationSystem"/>
      </div>
    )
  }

  openSimpleViewItem(item) {
    this.setState({...this.state, selectedItem: item, isItemSelected: true});
  }

  openNotificationSnackbar(message, level) {
    this.notificationSystem.addNotification({
      message: message,
      level: level || 'success',
      position: 'tc'
    });
  }

  getIcon(item) {
      switch (item) {
        case 'price': return 'fa-tag';
        case 'product': return 'fa-box';
        case 'discount': return 'fa-percent';
        case 'tax': return 'fa-dollar-sign';
        case 'taxonomy': return 'fa-project-diagram';
        case 'blog_entry': return 'fa-newspaper';
        case 'widget': return 'fa-puzzle-piece';
        default: return 'fa-folder'
      }
  }
}
