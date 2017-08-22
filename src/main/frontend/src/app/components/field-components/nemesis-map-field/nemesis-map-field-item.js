import React, {Component} from 'react';

import _ from 'lodash';

export default class NemesisMapFieldItem extends Component {
  constructor(props) {
    super(props);
    this.state = {key: props.item.key, value: props.item.value};
  }

  render() {
    return (
      <div className="nemesis-map-field-item">
        <div className="display-table" style={{width: '100%', margin: '3px 0'}}>
          <div className="display-table-cell" style={{width: '45%', paddingRight: '3px'}}>
            <input type="text"
                   placeholder="key"
                   className={'form-control' + (!!this.props.item.errorMessage ? ' has-error' : '')}
                   value={this.state.key}
                   onChange={(e) => this.onKeyChange(e.target.value)} />
          </div>
          <div className="display-table-cell" style={{width: '45%'}}>
            <input type="text"
                   placeholder="value"
                   className="form-control"
                   value={this.state.value}
                   onChange={(e) => this.onValueChange(e.target.value)} />
          </div>
          <div className="display-table-cell" style={{textAlign: 'center'}}>
            <i className="fa fa-remove remove-icon" onClick={() => this.props.removeField(this.props.item.id)}/>
          </div>
        </div>
        {this.props.item.errorMessage ? <div className="error-message">{this.props.item.errorMessage}</div> : false}
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.item, nextProps.item)) {
      return;
    }
    this.setState({...this.state, key: nextProps.item.key, value: nextProps.item.value})
  }

  onValueChange(value) {
    this.setState({...this.state, value: value});
  }

  onKeyChange(value) {
    this.setState({...this.state, key: value});
  }

  getFieldValue() {
    return {id: this.props.item.id, key: this.state.key, value: this.state.value};
  }

}
