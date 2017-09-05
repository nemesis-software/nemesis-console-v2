import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import Modal from 'react-bootstrap/lib/Modal';

export default class NemesisTextAreaField extends NemesisBaseField {
  constructor(props) {
    super(props);

    this.state = {...this.state, openFullScreenDialog: false};

  }

  render() {
    return (
      <div className="entity-field-container">
        <div className="entity-field-input-container">
          <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
          <input type="text"
                 className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '')}
                 value={this.state.value || ''}
                 disabled={this.props.readOnly}
                 onChange={(e) => this.onValueChange(e, e.target.value)} />
        </div>
        <i className="material-icons entity-navigation-icon" onClick={this.handleFullscreenClick.bind(this)}>fullscreen</i>
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        <Modal show={this.state.openFullScreenDialog} onHide={this.handleDialogClose.bind(this)}>
          <Modal.Header>
            <Modal.Title>Edit richtext</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
            <textarea className="entity-field form-control"
                      rows="10"
                      value={this.state.value || ''}
                      disabled={this.props.readOnly}
                      onChange={(e) => this.onValueChange(e, e.target.value)}/>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-default" onClick={this.handleDialogClose.bind(this)}>Done</button>
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