import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';

export default class AdminSpringBeans extends Component {
  constructor(props) {
    super(props);
    this.state = {context: '', beans: []};
  }

  componentWillMount() {
    PlatformApiCall.get('beans').then(result => {
      console.log(result);
      this.setState({context: result.data[0].context, beans: result.data[0].beans})
    })
  }

  render() {
    return (
      <div className="paper-box">
        Beans {this.state.context}
        <div>
          <table style={{width: '100%', tableLayout: 'fixed'}} className="table table-striped">
            <thead>
            <tr>
              <th>Bean</th>
              <th>Scope</th>
              <th>Type</th>
              <th>Resource</th>
              <th>Dependencies</th>
            </tr>
            </thead>
            <tbody>
            {
              this.state.beans.map((item, index) => {
                return (
                  <tr key={index}>
                    <td style={{wordWrap: 'break-word'}}>{item.bean}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.scope}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.type}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.resource}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.dependencies.join(', ')}</td>
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

}