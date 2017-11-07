import React, {Component} from 'react';
import Translate from 'react-translate-component';
import Select from 'react-select';

import counterpart from 'counterpart';

import SelectCustomArrow from '../../../../../helper-components/select-custom-arrow';

export default class FilterRestrictionField extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedRestrictionField: props.defaultValue || null};
  }

  handleChange(item) {
    let restrictionField = item && item.value;
    this.props.onRestrictionFieldChange(restrictionField);
    this.setState({selectedRestrictionField: restrictionField});
  }

  render() {
    return (
      <div className="filter-restriction-field" style={this.props.style}>
        {this.props.label ?
          <label>
            <Translate style={{paddingRight: '5px'}} component="span" content={'main.' + this.props.label} fallback={this.props.label}/>
            <Translate component="span" content={'main.restriction'} fallback={'restriction'}/>
          </label>
          :
          <label>Restriction</label>
        }
        <Select style={{width: '100%'}}
                className="filter-restriction-field-select"
                arrowRenderer={this.customArrow}
                disabled={this.props.readOnly}
                value={{value: this.state.selectedRestrictionField, label: this.state.selectedRestrictionField ? counterpart.translate('main.' + this.state.selectedRestrictionField, {fallback: this.state.selectedRestrictionField}) : null}}
                onChange={(item) => this.handleChange(item)}
                options={this.getOptions()}/>
      </div>
    )
  }

  getOptions() {
    return this.props.restrictionFields.map((field, index) => {
      return {value: field, label: <Translate component="span" key={index} value={field} content={'main.' + field} fallback={field}/>}
    });
  }

  customArrow() {
    return <SelectCustomArrow/>
  }
}