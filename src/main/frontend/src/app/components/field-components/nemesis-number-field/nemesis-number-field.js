import React  from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'

export default class NemesisNumberField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
        <input type="number" step={this.props.step || '1'}
               style={{width: '256px'}}
               className="entity-field form-control"
               value={this.state.value || ''}
               disabled={this.props.readOnly} onChange={(e) => this.onValueChange(e, e.target.value)}/>
      </div>
    )
  }
}