import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'
import { ChromePicker } from 'react-color';
import RaisedButton from 'material-ui/RaisedButton';

const popover = {
  position: 'absolute',
  zIndex: '1000',
};
const cover = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
};

export default class NemesisColorpickerField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = {...this.state, displayColorPicker: false};
  }

  render() {
    return (
    <div style={{position: 'relative'}}>
      <TextField style={this.props.style}
                 value={this.state.value || ''}
                 disabled={this.props.readOnly}
                 onFocus={this.handleClick.bind(this)}
                 floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                 />
          { this.state.displayColorPicker ?

            <div ref={(item) => item && item.focus()} style={ popover } onBlur={this.handleClose.bind(this)}>
              <ChromePicker color={this.state.value} onChange={(color, event) => this.onValueChange(event, color.hex)}/>
              <RaisedButton style={{width: '100%'}} onClick={this.handleClose.bind(this)} label={"Done"}/>
            </div> : null }
    </div>

    )
  }

  handleClick = () => {
    this.setState({...this.state, displayColorPicker: true });
    // this.addCoverElementToBody();
  };

  handleClose = () => {
    this.setState({...this.state, displayColorPicker: false });
    // console.log(this.coverElement);
    // document.body.removeChild(this.coverElement);
    // this.coverElement = null;
  };

  addCoverElementToBody() {
    let coverElement = document.createElement('div');
    coverElement.setAttribute('style', 'position: fixed; left: 0px; right: 0px; top: 0px; bottom: 0px; z-index: 1');
    coverElement.addEventListener('click', this.handleClose.bind(this));
    this.coverElement = coverElement;
    document.body.appendChild(coverElement);
  }
}