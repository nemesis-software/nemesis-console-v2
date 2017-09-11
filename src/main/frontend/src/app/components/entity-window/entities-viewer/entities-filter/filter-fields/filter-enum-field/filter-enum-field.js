import React, { Component } from 'react';

import { searchRestrictionTypes } from '../../../../../../types/nemesis-types';
import { componentRequire } from '../../../../../../utils/require-util';

let NemesisEnumField = componentRequire('app/components/field-components/nemesis-enum-field/nemesis-enum-field', 'nemesis-enum-field');

export default class FilterEnumField extends Component {
  constructor(props) {
    super(props);
    this.state = {enumField: props.defaultValue || null};
  }

  componentWillMount() {
    if (this.props.defaultValue) {
      this.updateParentFilter(this.props.defaultValue)
    }
  }

  render() {
    return (
      <div className="filter-item-container">
        <NemesisEnumField readOnly={this.props.readOnly} value={this.props.filterItem.values.indexOf(this.state.enumField)} values={this.props.filterItem.values} onValueChange={this.onEnumFieldChange.bind(this)} label={this.props.filterItem.fieldLabel}/>
      </div>
    )
  }

  onEnumFieldChange(value) {
    this.setState({enumField: value});
    this.updateParentFilter(value);
  }

  updateParentFilter(enumField)  {
    let actualValue = enumField ? `'${enumField}'` : null;
    this.props.onFilterChange({
      value: actualValue,
      restriction: searchRestrictionTypes.equals,
      field: this.props.filterItem.name,
      id: this.props.filterItem.name
    });
  }
}