import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import {Modal} from 'react-bootstrap';
import CodeMirror from 'react-codemirror';

export default class NemesisCodeField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = {...this.state, openFullScreenDialog: false};
    console.log(this.props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <div><Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />{this.props.required ? <span className="required-star">*</span> : false}</div>
          <input type="text"
                 className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '') + (this.props.required && !this.props.readOnly && this.isEmptyValue() ? ' empty-required-field' : '')}
                 value={this.state.value || ''}
                 disabled={this.props.readOnly}
                 onChange={(e) => this.onValueChange(e, e.target.value)} />
        </div>
        <i className="material-icons entity-navigation-icon" onClick={this.handleFullscreenClick.bind(this)}>fullscreen</i>
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        <Modal show={this.state.openFullScreenDialog} onHide={this.handleDialogClose.bind(this)} animation={false}>
          <Modal.Header>
            <Modal.Title>Edit text</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
            <CodeMirror onChange={code => this.onValueChange(null, code)} value={this.state.value}  options={{lineNumbers: true, mode: this.props.type}}/>
          </Modal.Body>
          <Modal.Footer>
            <button className="nemesis-button success-button" onClick={this.handleDialogClose.bind(this)}>Done</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

  handleFullscreenClick = () => {
    this.setState({...this.state, openFullScreenDialog: true });
  };

  handleDialogClose = () => {
    this.setState({...this.state, openFullScreenDialog: false });
  };
}
