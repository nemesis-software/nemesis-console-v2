import React from 'react';
import Translate from 'react-translate-component';
import NemesisBaseField from '../nemesis-base-field'

export default class NemesisPasswordField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="entity-field-container">
        <Translate component="label" content={'main.' + this.props.label} fallback={this.props.label} />
        <input type="password"
               style={{width: '256px'}}
               className={'entity-field form-control' + (!!this.state.errorMessage ? ' has-error' : '')}
               value={this.state.value || ''}
               disabled={this.props.readOnly} onChange={(e) => this.onValueChange(e, e.target.value)}/>
        {!!this.state.errorMessage ? <div className="error-container">{this.state.errorMessage}</div> : false}
      </div>
    )
  }
}