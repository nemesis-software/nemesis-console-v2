import React, {Component} from 'react';
import _ from 'lodash';

export default class AdminSystemPropertiesExpandable extends Component {
  constructor(props) {
    super(props);
    this.state = {isExpanded: true}
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="paper-box">
        <div onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>{this.props.name}</div>
        {this.state.isExpanded ? <div className="display-table">
          {this.getSystemProperties().map((item, index) => {
            return (
              <div className="table-row" key={index} style={{border: '1px solid red'}}>
                <div className="display-table-cell" style={{border: '1px solid green'}}>{item.key}</div>
                <div className="display-table-cell" style={{border: '1px solid blue'}}>{item.value}</div>
              </div>
            );
          })}
        </div> : false}
      </div>
    );
  }

  getSystemProperties() {
    let result = [];
    _.forIn(this.props.properties, (value, key) => {
      result.push({value: value, key: key});
    });
    console.log(result);
    return result;
  }

}