import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';
import webstomp from 'webstomp-client';
import SockJS from 'sockjs-client';

export default class AdminActions extends Component {
  constructor(props) {
    super(props);
    this.socketClient = null;
  }

  componentWillMount() {
    this.socketClient = webstomp.over(new SockJS(PlatformApiCall.getRestUrl() + '/stomp'));
    this.socketClient.connect({}, frame => {
      console.log(frame)
    }, err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div className="admin-action paper-box">
        <div className="admin-action-header"><i className="fa fa-crosshairs admin-action-header-icon" aria-hidden="true"></i>Actions</div>
        <button className="btn btn-default admin-action-btn"><i className="fa fa-refresh admin-action-btn-icon" aria-hidden="true"></i> Update</button>
        <button className="btn btn-default admin-action-btn"><i className="fa fa-bolt admin-action-btn-icon" aria-hidden="true"></i>Thread Dump</button>
        <button className="btn btn-default admin-action-btn"><i className="fa fa-hdd-o admin-action-btn-icon" aria-hidden="true"></i> Clear Cache</button>
        <button className="btn btn-default admin-action-btn"><i className="fa fa-info-circle admin-action-btn-icon" aria-hidden="true"></i>Initialize</button>
      </div>
    );
  }
}