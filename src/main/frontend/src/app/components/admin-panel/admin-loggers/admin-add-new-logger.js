import React from 'react';
import AdminExpandable from '../admin-expandable';
import Select from 'react-select';

export default class AdminAddNewLogger extends AdminExpandable {
  constructor(props) {
    super(props);
    this.state = {isExpanded: true, newLoggerName: '', newLoggerLevel: null};
  }

  getExpandedContent() {
    return (
      <div className="add-new-logger">
        <div className="input-group new-logger-fields">
          <input type="text"
                 style={{height: '36px'}}
                 value={this.state.newLoggerName}
                 placeholder="Logger name"
                 className="form-control"
                 onChange={this.onNewLoggerNameChange.bind(this)}/>
          <div style={{display: 'table-cell', verticalAlign: 'top'}}>
            <Select disabled={this.props.readOnly}
                    value={{value: this.state.newLoggerLevel, label: this.state.newLoggerLevel }}
                    onChange={(item) => this.handleNewLoggerLevelChange(item)}
                    options={this.getOptions()}/>
          </div>
        </div>
        <div className="button-container">
          <button disabled={!this.state.newLoggerLevel || !this.state.newLoggerName} className="nemesis-button success-button" onClick={this.handleOnAddLoggerClick.bind(this)}>Add Logger</button>
        </div>
      </div>
    );
  }

  getHeaderText() {
    return 'Add new logger';
  }

  onNewLoggerNameChange(ev) {
    this.setState({...this.state, newLoggerName: ev.target.value});
  }

  getOptions() {
    return this.props.levels.map((level) => {
      return {value: level, label: level}
    });
  }

  handleNewLoggerLevelChange(item) {
    let level = item && item.value;
    this.setState({...this.state, newLoggerLevel: level});
  }

  handleOnAddLoggerClick() {
    this.props.addNewLogger(this.state.newLoggerLevel, {name: this.state.newLoggerName}).then(() => {
      this.setState({...this.state, newLoggerName: '', newLoggerLevel: null})
    });
  }
}