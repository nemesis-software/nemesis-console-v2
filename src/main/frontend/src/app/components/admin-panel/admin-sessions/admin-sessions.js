import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';

import _ from 'lodash';

export default class AdminSessions extends Component {
  constructor(props) {
    super(props);
    this.state = {inputValue: null, sessions: []}
  }

  render() {
    return (
      <div className="admin-sessions">
        <div>
          <input type="text"
                 style={{width: '256px', display: 'inline-block', borderRadius: '0px', height: '36px', verticalAlign: 'top'}}
                 placeholder="Enter user code"
                 className="form-control"
                 value={this.state.inputValue || ''}
                 onChange={ev => this.setState({...this.state, inputValue: ev.target.value})}/>
          <button className="nemesis-button success-button" style={{height: '36px', padding: '8px 25px', marginLeft: '10px'}} onClick={this.onGetSessionButtonClick.bind(this)}>Get Sessions</button>
        </div>
        <div>
          <table style={{width: '100%', tableLayout: 'fixed'}} className="table table-striped">
            <thead>
            <tr>
              <th>Create Time</th>
              <th>Last Access time</th>
              <th>Id</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {
              this.state.sessions.map((item, index) => {
                return (
                  <tr key={index}>
                    <td style={{wordWrap: 'break-word'}}>{item.creationTime}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.lastAccessedTime}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.id}</td>
                    <td style={{wordWrap: 'break-word', color: 'red', cursor: 'pointer'}} onClick={() => {this.handleDeleteSessionButtonClick(item.id)}}>Delete</td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  onGetSessionButtonClick() {
    let userCode = this.state.inputValue;
    if (!userCode) {
      return;
    }

    PlatformApiCall.get('sessions', {username: userCode}).then(result => {
      this.setState({...this.state, sessions: result.data.sessions});
      console.log(result.data);
    }, err => {
      console.log(err);
    })
  }

  handleDeleteSessionButtonClick(sessionId) {
    PlatformApiCall.delete(`sessions/${sessionId}`).then(result => {
      let sessions = [...this.state.sessions];
      let sessionIndex = _.findIndex(sessions, {id: sessionId});

      if (sessionIndex > -1) {
        sessions.splice(sessionIndex, 1);
      }

      this.setState({...this.state, sessions: sessions});
      this.props.openNotificationSnackbar('Session successfully deleted!');
    }, err => {
      this.props.openNotificationSnackbar('Execution failed!', 'error');
    })
  }
}
