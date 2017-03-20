import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

export default class NemesisTextAreaField extends NemesisBaseField {
  constructor(props) {
    super(props);

    this.state = {...this.state, openFullScreenDialog: false};

  }

  render() {
    const actions = [
      <FlatButton
        label="Done"
        primary={true}
        onTouchTap={this.handleDialogClose.bind(this)}
      />
    ];
    return (
      <div>
      <TextField style={this.props.style}
                 value={this.state.value || ''}
                 disabled={this.props.readOnly}
                 floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                 onChange={this.onValueChange.bind(this)}/>
        <i className="material-icons" onClick={this.handleFullscreenClick.bind(this)}>fullscreen</i>
        <Dialog
          title="Edit text area"
          actions={actions}
          modal={true}
          open={this.state.openFullScreenDialog}
        >
          <TextField style={{width: '100%'}}
                     value={this.state.value || ''}
                     disabled={this.props.readOnly}
                     multiLine={true}
                     rows={10}
                     rowsMax={10}
                     floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                     onChange={this.onValueChange.bind(this)}/>
        </Dialog>
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