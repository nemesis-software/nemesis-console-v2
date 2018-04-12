import React, {Component} from 'react';

export default class AdminMappingsDispatcherServletsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isExpanded: false};
  }

  render() {
    return (
      <div className={'admin-mappings-dispatcher-servlets-item' + (this.state.isExpanded ? ' expanded' : '')}>
        <div className="servlets-item-main display-table" onClick={() => {this.setState({isExpanded: !this.state.isExpanded})}}>
          <span className="servlets-item-name display-table-cell">{this.props.servlet.predicate}</span>
          {/*<span className="display-table-cell"><span className={'admin-thread-state ' + (this.props.thread.threadState === 'RUNNABLE' ? 'runnable' : 'waiting')}>{this.props.thread.threadState}</span></span>*/}
        </div>
        {this.state.isExpanded ?
          <div className="admin-mappings-details">
            <div className="servlets-item-handler"><b>Handler:</b> {this.props.servlet.handler}</div>
            {this.props.servlet.details && this.props.servlet.details.handlerMethod ?
              <div className="servlets-item-handler-method">
                <div><b>Handler Method</b></div>
                <div><b>Class name: </b> {this.props.servlet.details.handlerMethod.className}</div>
                <div><b>Name: </b> {this.props.servlet.details.handlerMethod.name}</div>
              </div>
              : false}
            {this.props.servlet.details && this.props.servlet.details.requestMappingConditions ?
              <div className="servlets-item-request-conditions">
                <div><b>Request Mapping Conditions</b></div>
                <div><b>Patterns: </b> {this.props.servlet.details.requestMappingConditions.patterns.join(', ')}</div>
                <div><b>Methods: </b> {this.props.servlet.details.requestMappingConditions.methods.join(', ')}</div>
                <div><b>Produces: </b> {this.getProducesInfo(this.props.servlet.details.requestMappingConditions.produces)}</div>
              </div>
              : false}
          </div>
          : false }
      </div>
    );
  }

  getProducesInfo(produces) {
    let result = [];
    produces.forEach(produce => {
      result.push(produce.mediaType);
    });
    return result.join(', ');
  }
}