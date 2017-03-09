import React, { Component } from 'react';
import { nemesisFieldTypes, nemesisFieldUsageTypes } from '../../../../types/nemesis-types';
import NemesisTextField from '../../../field-components/nemesis-text-field/nemesis-text-field';
import NemesisTextareaField from '../../../field-components/nemesis-textarea-field/nemesis-textarea-field';
import NemesisPasswordField from '../../../field-components/nemesis-password-field/nemesis-password-field';
import NemesisDateField from '../../../field-components/nemesis-date-field/nemesis-date-field';
import NemesisNumberField from '../../../field-components/nemesis-number-field/nemesis-number-field';
import NemesisEnumField from '../../../field-components/nemesis-enum-field/nemesis-enum-field';
import NemesisEntityField from '../../../field-components/nemesis-entity-field/nemesis-entity-field';
import NemesisBooleanField from '../../../field-components/nemesis-boolean-field/nemesis-boolean-field';
import NemesisLocalizedTextField from '../../../field-components/nemesis-localized-text-field/nemesis-localized-text-field';
import NemesisLocalizedRichTextField from '../../../field-components/nemesis-localized-text-field/nemesis-localized-richtext-field';
import NemesisRichTextField from '../../../field-components/nemesis-richtext-field/nemesis-richtext-field';
import NemesisColorpickerField from '../../../field-components/nemesis-colorpicker-field/nemesis-colorpicker-field';
import NemesisMediaField from '../../../field-components/nemesis-media-field/nemesis-media-field';
import NemesisSimpleCollectionField from '../../../field-components/nemesis-collection-field/nemesis-simple-collection-field/nemesis-simple-collection-field';
import NemesisEntityCollectionField from '../../../field-components/nemesis-collection-field/nemesis-entity-collection-field/nemesis-entity-collection-field';

export default class EntitySection extends Component {
  constructor(props) {
    super(props);
    this.fieldsReferences = [];
  }
  render() {
    return (
      <div>
        <div>Title: {this.props.section.title}</div>
        {this.props.section.items.map((item, index) => this.getSectionItemRenderer(item, index))}
      </div>
    )
  }

  componentWillMount() {
    this.fieldsReferences = [];
  }

  componentWillUpdate() {
    this.fieldsReferences = [];
  }

  getSectionItemRenderer(item, index) {
    let reactElement;
    let itemName = item.name.replace('entity-', '');
    let elementConfig ={
      key: index,
      label: item.fieldLabel,
      name: itemName,
      readOnly: item.readOnly,
      required: item.required,
      value: this.getItemValue(item, itemName),
      type: nemesisFieldUsageTypes.edit,
      ref: (field) => { field && this.fieldsReferences.push(field)}
    };

    switch (item.xtype) {
      case nemesisFieldTypes.nemesisTextField: reactElement = NemesisTextField; break;
      case nemesisFieldTypes.nemesisTextarea: reactElement = NemesisTextareaField; break;
      case nemesisFieldTypes.nemesisHtmlEditor: reactElement = NemesisRichTextField; break;
      case nemesisFieldTypes.nemesisPasswordField: reactElement = NemesisPasswordField; break;
      case nemesisFieldTypes.nemesisDateField: reactElement = NemesisDateField; break;
      case nemesisFieldTypes.nemesisDecimalField: elementConfig.step = '0.1'; reactElement = NemesisNumberField; break;
      case nemesisFieldTypes.nemesisIntegerField: reactElement = NemesisNumberField; break;
      case nemesisFieldTypes.nemesisBooleanField: reactElement = NemesisBooleanField; break;
      case nemesisFieldTypes.nemesisEnumField: elementConfig.values = item.values; elementConfig.value = item.values.indexOf(elementConfig.value); reactElement = NemesisEnumField; break;
      case nemesisFieldTypes.nemesisEntityField: elementConfig.entityId = item.entityId; elementConfig.onEntityItemClick= this.props.onEntityItemClick; reactElement = NemesisEntityField; break;
      case nemesisFieldTypes.nemesisLocalizedTextField: reactElement = NemesisLocalizedTextField; break;
      case nemesisFieldTypes.nemesisLocalizedRichtextField: reactElement = NemesisLocalizedRichTextField; break;
      case nemesisFieldTypes.nemesisColorpickerField: reactElement = NemesisColorpickerField; break;
      case nemesisFieldTypes.nemesisMediaField: reactElement = NemesisMediaField; break;
      case nemesisFieldTypes.nemesisSimpleCollectionField: elementConfig.value = elementConfig.value || []; reactElement = NemesisSimpleCollectionField; break;
      case nemesisFieldTypes.nemesisCollectionField: elementConfig.readOnly = true; elementConfig.onEntityItemClick= this.props.onEntityItemClick; elementConfig.entityId = item.entityId; elementConfig.value = elementConfig.value || []; reactElement = NemesisEntityCollectionField; break;
      default: return <div key={index}>Not supported yet - {item.xtype}</div>
    }

    return React.createElement(reactElement, elementConfig)
  }

  getItemValue(item, itemName) {
    if ([nemesisFieldTypes.nemesisEntityField, nemesisFieldTypes.nemesisCollectionField].indexOf(item.xtype) > -1) {
      return this.props.entityData.customClientData && this.props.entityData.customClientData[itemName];
    }

    return this.props.entityData[itemName];
  }

  getDirtyValues() {
    let result = [];
    this.fieldsReferences.forEach(field => {
      let dirtyValue = field.getChangeValue();
      if (dirtyValue) {
        result.push(dirtyValue);
      }
    });
    return result;
  }
}