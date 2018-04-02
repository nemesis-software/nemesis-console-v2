import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import Modal from 'react-bootstrap/lib/Modal';

import { componentRequire } from '../../../utils/require-util';
let HtmlEditor = componentRequire('app/custom-components/html-editor/html-editor', 'html-editor');

export default class NemesisRichTextField extends NemesisBaseField {
  constructor(props) {
    super(props);

    this.state = {...this.state, openFullScreenDialog: false};
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
        <i className="fa fa-code entity-navigation-icon" onClick={this.handleFullscreenClick.bind(this)}/>
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
        <Modal show={this.state.openFullScreenDialog} onHide={this.handleDialogClose.bind(this)} backdrop="static">
          <Modal.Header>
            <Modal.Title><Translate content={'main.Edit richtext'} fallback={'Edit richtext'} /></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
            <HtmlEditor htmlContent={this.state.value} onChange={(value) => this.onValueChange(null, value)}/>
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