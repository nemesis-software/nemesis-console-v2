import React, {Component} from 'react';

import { nemesisFieldTypes, nemesisFieldUsageTypes } from '../../types/nemesis-types';

import { componentRequire } from '../../utils/require-util';

import LanguageChanger from '../language-changer';

const translationLanguages = {
  languages: [
    {value: 'en', labelCode: 'English'},
    {value: 'bg_BG', labelCode: 'Bulgarian'},
  ],
  defaultLanguage: {value: 'en', labelCode: 'English'}
};

let NemesisTextField = componentRequire('app/components/field-components/nemesis-text-field/nemesis-text-field', 'nemesis-text-field');
let NemesisTextareaField = componentRequire('app/components/field-components/nemesis-textarea-field/nemesis-textarea-field', 'nemesis-textarea-field');
let NemesisPasswordField = componentRequire('app/components/field-components/nemesis-password-field/nemesis-password-field', 'nemesis-password-field');
let NemesisDateField = componentRequire('app/components/field-components/nemesis-date-time-field/nemesis-date-field', 'nemesis-date-field');
let NemesisDateTimeField = componentRequire('app/components/field-components/nemesis-date-time-field/nemesis-date-time-field', 'nemesis-date-time-field');
let NemesisNumberField = componentRequire('app/components/field-components/nemesis-number-field/nemesis-number-field', 'nemesis-number-field');
let NemesisEnumField = componentRequire('app/components/field-components/nemesis-enum-field/nemesis-enum-field', 'nemesis-enum-field');
let NemesisEntityField = componentRequire('app/components/field-components/nemesis-entity-field/nemesis-entity-field', 'nemesis-entity-field');
let NemesisBooleanField = componentRequire('app/components/field-components/nemesis-boolean-field/nemesis-boolean-field', 'nemesis-boolean-field');
let NemesisSimpleLocalizedTextField = componentRequire('app/components/field-components/nemesis-simple-localized-text-field/nemesis-simple-localized-text-field', 'nemesis-simple-localized-text-field');
let NemesisSimpleLocalizedRichTextField = componentRequire('app/components/field-components/nemesis-simple-localized-text-field/nemesis-simple-localized-richtext-field', 'nemesis-simple-localized-richtext-field');
let NemesisRichTextField = componentRequire('app/components/field-components/nemesis-richtext-field/nemesis-richtext-field', 'nemesis-richtext-field');
let NemesisColorpickerField = componentRequire('app/components/field-components/nemesis-colorpicker-field/nemesis-colorpicker-field', 'nemesis-colorpicker-field');
let NemesisMediaField = componentRequire('app/components/field-components/nemesis-media-field/nemesis-media-field', 'nemesis-media-field');
let NemesisMapField = componentRequire('app/components/field-components/nemesis-map-field/nemesis-map-field', 'nemesis-map-field');
let NemesisSimpleCollectionField = componentRequire('app/components/field-components/nemesis-collection-field/nemesis-simple-collection-field/nemesis-simple-collection-field', 'nemesis-simple-collection-field');
let NemesisEntityCollectionField = componentRequire('app/components/field-components/nemesis-collection-field/nemesis-entity-collection-field/nemesis-entity-collection-field', 'nemesis-entity-collection-field');


export default class RoleEntityItemView extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.fieldsReferences = [];
  }

  componentWillMount() {
    this.fieldsReferences = [];
  }

  componentWillUpdate() {
    this.fieldsReferences = [];
  }

  render() {
    return (
      <div>
        <div>
          <LanguageChanger
            readOnly={this.props.readOnly}
            label="language"
            selectClassName="entity-field"
            style={{marginRight: '15px', ...this.props.style}}
            onLanguageChange={this.onLanguageChange.bind(this)}
            availableLanguages={translationLanguages.languages}
            selectedLanguage={this.props.defaultLanguage || translationLanguages.defaultLanguage}
          />
        </div>
        <div style={{display: 'inline-block', width: '70%', verticalAlign: 'top'}}>
          {this.props.entityFields.mainView.map((item, key) => {
            return <div>{this.getSectionItemRenderer(item, key)}</div>
          })}
        </div>
        <div style={{display: 'inline-block', width: '25%', verticalAlign: 'top'}}>
          {this.props.entityFields.sideBar.map((item, key) => {
            return <div key={key}>{item.groupName}</div>
          })}
        </div>
      </div>
    )
  }

  getItemValue(item, itemName) {
    if ([nemesisFieldTypes.nemesisEntityField, nemesisFieldTypes.nemesisCollectionField].indexOf(item.xtype) > -1) {
      return this.props.entityData.customClientData && this.props.entityData.customClientData[itemName];
    }

    return this.props.entityData[itemName];
  }

  onLanguageChange(language) {
    this.fieldsReferences.forEach(field => {
      if (field.onLanguageChange) (
        field.onLanguageChange(language)
      )
    });
  }

  getSectionItemRenderer(item, index) {
    let reactElement;
    let itemName = item.name.replace('entity-', '');
    let elementConfig = {
      mainEntity: this.props.entity,
      label: item.fieldLabel,
      name: itemName,
      readOnly: item.readOnly,
      required: false, //item.required,
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
      case nemesisFieldTypes.nemesisLocalizedTextField: reactElement = NemesisSimpleLocalizedTextField; break;
      case nemesisFieldTypes.nemesisLocalizedRichtextField: reactElement = NemesisSimpleLocalizedRichTextField; break;
      case nemesisFieldTypes.nemesisColorpickerField: reactElement = NemesisColorpickerField; break;
      case nemesisFieldTypes.nemesisMediaField: reactElement = NemesisMediaField; break;
      case nemesisFieldTypes.nemesisMapField: reactElement = NemesisMapField; break;
      case nemesisFieldTypes.nemesisSimpleCollectionField: elementConfig.value = elementConfig.value || []; reactElement = NemesisSimpleCollectionField; break;
      case nemesisFieldTypes.nemesisCollectionField: elementConfig.onEntityItemClick= this.props.onEntityItemClick; elementConfig.entityId = item.entityId; elementConfig.value = elementConfig.value || []; reactElement = NemesisEntityCollectionField; break;
      default: return <div key={index}>Not supported yet - {item.xtype}</div>
    }

    return React.createElement(reactElement, elementConfig)
  }
}