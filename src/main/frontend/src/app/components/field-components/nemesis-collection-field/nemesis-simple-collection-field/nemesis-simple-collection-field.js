import React from 'react';
import NemesisBaseCollectionField from '../nemesis-base-collection-field';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';

export default class NemesisSimpleCollectionField extends NemesisBaseCollectionField {
  constructor(props) {
    super(props);
  }

  getInputField() {
    return (
      <TextField style={this.props.style}
                 disabled={this.props.readOnly}
                 floatingLabelText={<Translate content={'main.' + this.props.label} fallback={this.props.label} />}
                 onKeyPress={this.onInputKeyPress.bind(this)}/>
    )
  }

  onInputKeyPress(e) {
    if (e.key === 'Enter') {
      let valueActual = this.state.value || [];
      valueActual.push(e.target.value);
      this.setState({...this.state, value: valueActual});
    }
  }
}