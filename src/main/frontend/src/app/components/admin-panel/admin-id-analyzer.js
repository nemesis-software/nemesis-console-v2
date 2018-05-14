import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';
import _ from 'lodash';

export default class AdminIdAnalyzer extends Component {
  constructor(props) {
    super(props);
    this.state = {inputValue: null, queryResult: {}}
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="paper-box">
        <div>
        <input type="text"
               style={{width: '256px', display: 'inline-block'}}
               placeholder="Enter ID"
               className="form-control"
               value={this.state.inputValue || ''}
               onChange={ev => this.setState({...this.state, inputValue: ev.target.value})}/>
          <button className="btn btn-default" onClick={this.onDecodeButtonClick.bind(this)}>Decode</button>
        </div>
        <div>
          <div><b>ID Discriminator:</b> {this.state.queryResult.idDiscriminator}</div>
          <div><b>Entity name:</b> {this.state.queryResult.entityName}</div>
          <div><b>Canonical class name:</b> {this.state.queryResult.canonicalClassName}</div>
        </div>
      </div>
    );
  }

  onDecodeButtonClick() {
    let valueForDecode = this.state.inputValue;
    if (!valueForDecode) {
      return;
    }

    PlatformApiCall.get(`entity/${valueForDecode}`).then(result => {
      this.setState({...this.state, queryResult: result.data})
    }, err => {
      this.setState({...this.state, queryResult: {idDiscriminator: 'INVALID ID'}})
    })
  }
}