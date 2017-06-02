import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import Modal from 'react-bootstrap/lib/Modal';
import HtmlEditor from '../../../custom-components/html-editor';

export default class NemesisRichTextField extends NemesisBaseField {
  constructor(props) {
    super(props);

    this.state = {...this.state, openFullScreenDialog: false};
  }

  render() {
    return (
      <div className="entity-field-container">
        <div style={{width: '256px', display: 'inline-block'}}>
          <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
          <input type="text"
                 className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '')}
                 value={this.state.value || ''}
                 disabled={this.props.readOnly}
                 onChange={(e) => this.onValueChange(e, e.target.value)} />
        </div>
        <i className="material-icons entity-navigation-icon" onClick={this.handleFullscreenClick.bind(this)}>fullscreen</i>
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        <Modal show={this.state.openFullScreenDialog} onHide={this.handleDialogClose.bind(this)} backdrop="static">
          <Modal.Header>
            <Modal.Title>Edit richtext</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
            <HtmlEditor htmlContent={this.state.value} onChange={(value) => this.onValueChange(null, value)}/>
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