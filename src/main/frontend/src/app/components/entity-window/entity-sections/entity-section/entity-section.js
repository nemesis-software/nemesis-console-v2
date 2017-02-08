import React, { Component } from 'react';
import { nemesisFieldTypes, nemesisFieldUsageTypes } from '../../../../types/nemesis-types';
import NemesisTextField from '../../../field-components/nemesis-text-field/nemesis-text-field';
import NemesisDateField from '../../../field-components/nemesis-date-field/nemesis-date-field';
import NemesisIntegerField from '../../../field-components/nemesis-number-field/nemesis-interger-field/nemesis-interger-field';
import NemesisDecimalField from '../../../field-components/nemesis-number-field/nemesis-decimal-field/nemesis-decimal-field';

export default class EntitySection extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    console.log(this.props);
    return (
      <div>
        <div>Title: {this.props.section.title}</div>
        {this.props.section.items.map((item, index) => this.getSectionItemRenderer(item, index))}
      </div>
    )
  }

  getSectionItemRenderer(item, index) {
    let reactElement;
    switch (item.xtype) {
      case nemesisFieldTypes.nemesisTextField: reactElement = NemesisTextField; break;
      case nemesisFieldTypes.nemesisDateField: reactElement = NemesisDateField; break;
      case nemesisFieldTypes.nemesisIntegerField: reactElement = NemesisIntegerField; break;
      case nemesisFieldTypes.nemesisDecimalField: reactElement = NemesisDecimalField; break;
      default: return <div key={index}>Not supported yet - {item.xtype}</div>
    }

    return React.createElement(reactElement, {
      key: index,
      label: item.fieldLabel,
      name: item.name,
      readOnly: item.readOnly,
      required: item.required,
      value: this.props.entityData[item.name],
      type: nemesisFieldUsageTypes.edit
    })
  }
}