import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'
import { ChromePicker } from 'react-color';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

export default class NemesisColorpickerField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = {...this.state, displayColorPicker: false};
  }

  render() {
    const actions = [
      <FlatButton
        label="Done"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />
    ];

    return (
    <div className="entity-field-container">
      <TextField className="entity-field" style={this.props.style}
                 value={this.state.value || ''}
                 disabled={this.props.readOnly}
                 onChange={this.onValueChange.bind(this)}
                 floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                 />
      <i className="material-icons entity-navigation-icon" onClick={this.handleClick.bind(this)}>color_lens</i>
      <Dialog
        title="Select Color"
        actions={actions}
        modal={true}
        contentStyle={{width: '350px'}}
        open={this.state.displayColorPicker}
      >
        <ChromePicker color={this.state.value} disableAlpha={true} onChange={(color, event) => this.onValueChange(event, color.hex)}/>
      </Dialog>
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