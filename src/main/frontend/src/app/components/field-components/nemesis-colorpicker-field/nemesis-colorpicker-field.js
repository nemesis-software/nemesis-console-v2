import React from 'react';
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
      <div style={{width: '256px', display: 'inline-block'}}>
        <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
        <input type="text"
               className="entity-field form-control"
               value={this.state.value || ''}
               disabled={this.props.readOnly}
               onChange={(e) => this.onValueChange(e, e.target.value)} />
      </div>
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