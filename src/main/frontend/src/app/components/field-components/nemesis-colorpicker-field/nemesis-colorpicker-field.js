import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'
import { ChromePicker } from 'react-color';
import Modal from 'react-bootstrap/lib/Modal';

export default class NemesisColorpickerField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = {...this.state, displayColorPicker: false};
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
      <i className="material-icons entity-navigation-icon" onClick={this.handleClick.bind(this)}>color_lens</i>
      {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
      <Modal bsSize="small" show={this.state.displayColorPicker} onHide={this.handleClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Select color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChromePicker color={this.state.value} disableAlpha={true} onChange={(color, event) => this.onValueChange(event, color.hex)}/>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.handleClose.bind(this)}>Done</button>
        </Modal.Footer>
      </Modal>
    </div>

    )
  }

  handleClick = () => {
    this.setState({...this.state, displayColorPicker: true });
  };

  handleClose = () => {
    this.setState({...this.state, displayColorPicker: false });
  };
}