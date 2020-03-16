import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import _ from 'lodash';
import counterpart from 'counterpart';
import AddNewLogger from './admin-add-new-logger'


export default class AdminLoggers extends Component {
  constructor(props) {
    super(props);
    this.state = {levels: [], loggers: {}, filteredLoggers: [], searchInput: ''};
  }

  componentDidMount() {
   this.populateLoggers();
  }

  render() {
    return (
      <div className="admin-loggers">
        <div className="input-group">
          <input type="text"
                 placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search" /></span>
        </div>
        <AddNewLogger addNewLogger={this.setLoggerLevel.bind(this)} levels={this.state.levels}/>
        <div className="display-table" style={{width: '100%'}}>
          {this.state.filteredLoggers.map(logger => {
            return <div className="display-table-row" key={logger.name}>
              <div className="display-table-cell">{logger.name}</div>
              <div className="display-table-cell" style={{textAlign: 'right'}}>{this.getLoggerButtons(logger)}</div>
            </div>
          })}
        </div>
      </div>
    );
  }

  getLoggerButtons(logger) {
    return (
      <div className="btn-group">
        {this.state.levels.map((level, index) => {
          return <button className={'btn btn-default ' + level.toLowerCase() + (level === logger.level ? ' current-level' :'')}
                         key={index} onClick={() => this.setLoggerLevel(level, logger)}>{level}</button>
        })}
      </div>
    )
  }

  setLoggerLevel(level, logger) {
    if (level === logger.level) {
      return;
    }

    return PlatformApiCall.post(`loggers/${logger.name}`, {configuredLevel: level}).then(this.populateLoggers.bind(this));
  }

  populateLoggers() {
    return PlatformApiCall.get('loggers').then(result => {
      this.setState({levels: _.values(result.data.levels), loggers: result.data.loggers, filteredLoggers: this.getFilteredLoggers(result.data.loggers, this.state.searchInput)})
    });
  }

  getFilteredLoggers(loggers, searchInput) {
    let result = [];
    _.forIn(loggers, (value, key) => {
      if (!searchInput || (key.toLowerCase().indexOf(searchInput.toLowerCase()) > -1)) {
        result.push({name: key, level: value.configuredLevel})
      }
    });

    return result;
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    this.setState({...this.state, searchInput:searchValue , filteredLoggers: this.getFilteredLoggers(this.state.loggers, searchValue)});
  }

}