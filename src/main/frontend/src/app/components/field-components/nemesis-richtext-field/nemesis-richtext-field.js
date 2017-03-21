import React from 'react';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

export default class NemesisRichTextField extends NemesisBaseField {
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
      <div className="entity-field-container">
        <TextField className="entity-field"
                   style={this.props.style}
                   value={this.state.value || ''}
                   disabled={this.props.readOnly}
                   errorText={this.state.errorMessage}
                   floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                   onChange={this.onValueChange.bind(this)}/>
        <i className="material-icons entity-navigation-icon" onClick={this.handleFullscreenClick.bind(this)}>fullscreen</i>
        <Dialog
          title="Edit richtext"
          actions={actions}
          modal={true}
          open={this.state.openFullScreenDialog}
          autoScrollBodyContent={true}
        >
          <TextField style={{width: '100%'}}
                     value={this.state.value || ''}
                     disabled={this.props.readOnly}
                     multiLine={true}
                     rows={6}
                     rowsMax={6}
                     floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                     onChange={this.onValueChange.bind(this)}/>
          <div dangerouslySetInnerHTML={{__html: this.state.value || ''}}></div>
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