import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import _ from 'lodash';

export default class AdminLoggers extends Component {
  constructor(props) {
    super(props);
    this.state = {levels: [], loggers: {}, filteredLoggers: {}};
  }

  componentWillMount() {
   this.populateLoggers();
  }

  render() {
    return (
      <div className="admin-loggers">
        <div className="display-table" style={{width: '100%'}}>
          {this.getLoggers().map(logger => {
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
                         key={index} onClick={() => this.changeLoggerLevel(level, logger)}>{level}</button>
        })}
      </div>
    )
  }

  getLoggers() {
    let result = [];
    _.forIn(this.state.filteredLoggers, (value, key) => {
      result.push({name: key, level: value.configuredLevel})
    });

    return result;
  }

  changeLoggerLevel(level, logger) {
    if (level === logger.level) {
      return;
    }

    PlatformApiCall.post(`loggers/${logger.name}`, {configuredLevel: level}).then(this.populateLoggers.bind(this));
  }

  populateLoggers() {
    PlatformApiCall.get('loggers').then(result => {
      this.setState({levels: _.values(result.data.levels), loggers: result.data.loggers, filteredLoggers: result.data.loggers})
    });
  }
}