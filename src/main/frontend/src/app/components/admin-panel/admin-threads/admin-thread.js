import React, {Component} from 'react';

export default class AdminThread extends Component {
  constructor(props) {
    super(props);
    this.state = {isExpanded: false};
  }

  render() {
    return (
      <div className={'admin-thread' + (this.state.isExpanded ? ' expanded' : '')}>
        <div className="admin-thread-main display-table" onClick={() => {this.setState({isExpanded: !this.state.isExpanded})}}>
          <span className="admin-thread-id display-table-cell">{this.props.thread.threadId}</span>
          <span className="admin-thread-name display-table-cell">{this.props.thread.threadName}</span>
          <span className="display-table-cell"><span className={'admin-thread-state ' + (this.props.thread.threadState === 'RUNNABLE' ? 'runnable' : 'waiting')}>{this.props.thread.threadState}</span></span>
        </div>
        {this.state.isExpanded ?
          <div className="admin-thread-details">
            Blocked Time: {this.props.thread.blockedTime} <br/>
            Blocked Count: {this.props.thread.blockedCount} <br/>
            Waited Count: {this.props.thread.waitedCount} <br/>
            Waited time: {this.props.thread.waitedTime} <br/>
            Lock name: {this.props.thread.lockName} <br/>
            Lock owner id: {this.props.thread.lockOwnerId} <br/>
            Lock owner name: {this.props.thread.lockOwnerName} <br/>
            Stack Trace: <br/>
            <div className="admin-thread-stack-trace">
              {this.props.thread.stackTrace.map((item, index) => {
                return <div key={index}>{item.className}.{item.methodName}({item.fileName}:{item.lineNumber})</div>
              })}
            </div>
          </div>
          : false }
      </div>
    );
  }
}