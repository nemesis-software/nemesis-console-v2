import React, { Component } from 'react';

import { nemesisFieldTypes, nemesisFieldUsageTypes } from '../../../../types/nemesis-types';
import { componentRequire } from '../../../../utils/require-util';

let NemesisTextField = componentRequire('app/components/field-components/nemesis-text-field/nemesis-text-field', 'nemesis-text-field');
let NemesisTextareaField = componentRequire('app/components/field-components/nemesis-textarea-field/nemesis-textarea-field', 'nemesis-textarea-field');
let NemesisPasswordField = componentRequire('app/components/field-components/nemesis-password-field/nemesis-password-field', 'nemesis-password-field');
let NemesisDateField = componentRequire('app/components/field-components/nemesis-date-time-field/nemesis-date-field', 'nemesis-date-field');
let NemesisDateTimeField = componentRequire('app/components/field-components/nemesis-date-time-field/nemesis-date-time-field', 'nemesis-date-time-field');
let NemesisNumberField = componentRequire('app/components/field-components/nemesis-number-field/nemesis-number-field', 'nemesis-number-field');
let NemesisEnumField = componentRequire('app/components/field-components/nemesis-enum-field/nemesis-enum-field', 'nemesis-enum-field');
let NemesisEntityField = componentRequire('app/components/field-components/nemesis-entity-field/nemesis-entity-field', 'nemesis-entity-field');
let NemesisBooleanField = componentRequire('app/components/field-components/nemesis-boolean-field/nemesis-boolean-field', 'nemesis-boolean-field');
let NemesisLocalizedTextField = componentRequire('app/components/field-components/nemesis-localized-text-field/nemesis-localized-text-field', 'nemesis-localized-text-field');
let NemesisLocalizedRichTextField = componentRequire('app/components/field-components/nemesis-localized-text-field/nemesis-localized-richtext-field', 'nemesis-localized-richtext-field');
let NemesisRichTextField = componentRequire('app/components/field-components/nemesis-richtext-field/nemesis-richtext-field', 'nemesis-richtext-field');
let NemesisColorpickerField = componentRequire('app/components/field-components/nemesis-colorpicker-field/nemesis-colorpicker-field', 'nemesis-colorpicker-field');
let NemesisMediaField = componentRequire('app/components/field-components/nemesis-media-field/nemesis-media-field', 'nemesis-media-field');
let NemesisMapField = componentRequire('app/components/field-components/nemesis-map-field/nemesis-map-field', 'nemesis-map-field');
let NemesisSimpleCollectionField = componentRequire('app/components/field-components/nemesis-collection-field/nemesis-simple-collection-field/nemesis-simple-collection-field', 'nemesis-simple-collection-field');
let NemesisEntityCollectionField = componentRequire('app/components/field-components/nemesis-collection-field/nemesis-entity-collection-field/nemesis-entity-collection-field', 'nemesis-entity-collection-field');

export default class EntitySection extends Component {
  constructor(props) {
    super(props);
    this.fieldsReferences = [];
  }
  render() {
    return (
      <div style={{minHeight: 'calc(100vh - 205px)', background: 'white'}}>
        {this.props.section.items.map((item, index) => {
          return (
            <div className="paper-box with-hover" key={index} style={this.getPaperStyles(item)}>
              {this.getSectionItemRenderer(item, index)}
            </div>
          )
        })}
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
      mainEntity: this.props.entity,
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
      case nemesisFieldTypes.nemesisDateTimeField: reactElement = NemesisDateTimeField; break;
      case nemesisFieldTypes.nemesisDecimalField: elementConfig.step = '0.1'; reactElement = NemesisNumberField; break;
      case nemesisFieldTypes.nemesisIntegerField: reactElement = NemesisNumberField; break;
      case nemesisFieldTypes.nemesisBooleanField: reactElement = NemesisBooleanField; break;
      case nemesisFieldTypes.nemesisEnumField: elementConfig.values = item.values; elementConfig.value = item.values.indexOf(elementConfig.value); reactElement = NemesisEnumField; break;
      case nemesisFieldTypes.nemesisEntityField: elementConfig.entityId = item.entityId; elementConfig.onEntityItemClick= this.props.onEntityItemClick; reactElement = NemesisEntityField; break;
      case nemesisFieldTypes.nemesisLocalizedTextField: reactElement = NemesisLocalizedTextField; break;
      case nemesisFieldTypes.nemesisLocalizedRichtextField: reactElement = NemesisLocalizedRichTextField; break;
      case nemesisFieldTypes.nemesisColorpickerField: reactElement = NemesisColorpickerField; break;
      case nemesisFieldTypes.nemesisMediaField: reactElement = NemesisMediaField; break;
      case nemesisFieldTypes.nemesisMapField: reactElement = NemesisMapField; break;
      case nemesisFieldTypes.nemesisSimpleCollectionField: elementConfig.value = elementConfig.value || []; reactElement = NemesisSimpleCollectionField; break;
      case nemesisFieldTypes.nemesisCollectionField: elementConfig.onEntityItemClick= this.props.onEntityItemClick; elementConfig.entityId = item.entityId; elementConfig.value = elementConfig.value || []; reactElement = NemesisEntityCollectionField; break;
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

  isFieldsValid() {
    let isNotValid = false;
    this.fieldsReferences.forEach(field => {
      let isFieldValid = field.isFieldValid();
      isNotValid = isNotValid || !isFieldValid;
    });
    return !isNotValid;
  }

  getSectionIndex() {
    return this.props.sectionIndex;
  }

  resetDirtyStates() {
    this.fieldsReferences.forEach(field => {
      field.resetDirtyState();
    });
  }

  getPaperStyles(item) {
    let style = {margin: '5px', padding: '5px', display: 'inline-block', minHeight: '95px'};
    if ([nemesisFieldTypes.nemesisCollectionField, nemesisFieldTypes.nemesisMediaField, nemesisFieldTypes.nemesisSimpleCollectionField].indexOf(item.xtype) > -1) {
      style.width = 'calc(100% - 10px)';
    }
    return style;
  }
}