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
      <div className={'admin-system-properties-expandable' + (this.state.isExpanded ? ' expanded' : '')}>
        <div className="properties-header" onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>{this.props.name}</div>
        {this.state.isExpanded ? <div><table style={{width: '100%', tableLayout: 'fixed'}} className="table table-striped">
          <tbody>
            {this.getSystemProperties().map((item, index) => {
              return (
                <tr key={index}>
                  <td >{item.key}</td>
                  <td >{item.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table></div> : false}
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