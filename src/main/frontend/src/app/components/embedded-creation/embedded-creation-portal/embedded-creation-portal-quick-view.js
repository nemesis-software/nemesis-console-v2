import React, {Component} from 'react';

import PropTypes from 'prop-types';

import { nemesisFieldTypes, nemesisFieldUsageTypes } from '../../../types/nemesis-types';

import _ from 'lodash';
import { componentRequire } from '../../../utils/require-util';

let NemesisTextField = componentRequire('app/components/field-components/nemesis-text-field/nemesis-text-field', 'nemesis-text-field');
let NemesisTextareaField = componentRequire('app/components/field-components/nemesis-textarea-field/nemesis-textarea-field', 'nemesis-textarea-field');
let NemesisCodeField = componentRequire('app/components/field-components/nemesis-code-field/nemesis-code-field', 'nemesis-code-field');
let NemesisPasswordField = componentRequire('app/components/field-components/nemesis-password-field/nemesis-password-field', 'nemesis-password-field');
let NemesisDateField = componentRequire('app/components/field-components/nemesis-date-time-field/nemesis-date-field', 'nemesis-date-field');
let NemesisDateTimeField = componentRequire('app/components/field-components/nemesis-date-time-field/nemesis-date-time-field', 'nemesis-date-time-field');
let NemesisMoneyField = componentRequire('app/components/field-components/nemesis-money-field/nemesis-money-field', 'nemesis-money-field');
let NemesisNumberField = componentRequire('app/components/field-components/nemesis-number-field/nemesis-number-field', 'nemesis-number-field');
let NemesisEnumField = componentRequire('app/components/field-components/nemesis-enum-field/nemesis-enum-field', 'nemesis-enum-field');
let NemesisEntityField = componentRequire('app/components/field-components/nemesis-entity-field/nemesis-entity-field', 'nemesis-entity-field');
let NemesisBuildingBlockEntityField = componentRequire('app/components/field-components/nemesis-building-block-entity-field/nemesis-building-block-entity-field', 'nemesis-building-block-entity-field');
let NemesisBooleanField = componentRequire('app/components/field-components/nemesis-boolean-field/nemesis-boolean-field', 'nemesis-boolean-field');
let NemesisSimpleLocalizedTextField = componentRequire('app/components/field-components/nemesis-simple-localized-text-field/nemesis-simple-localized-text-field', 'nemesis-simple-localized-text-field');
let NemesisSimpleLocalizedRichTextField = componentRequire('app/components/field-components/nemesis-simple-localized-text-field/nemesis-simple-localized-richtext-field', 'nemesis-simple-localized-richtext-field');
let NemesisRichTextField = componentRequire('app/components/field-components/nemesis-richtext-field/nemesis-richtext-field', 'nemesis-richtext-field');
let NemesisColorpickerField = componentRequire('app/components/field-components/nemesis-colorpicker-field/nemesis-colorpicker-field', 'nemesis-colorpicker-field');
let NemesisMediaField = componentRequire('app/components/field-components/nemesis-media-field/nemesis-media-field', 'nemesis-media-field');
let NemesisMapField = componentRequire('app/components/field-components/nemesis-map-field/nemesis-map-field', 'nemesis-map-field');
let NemesisSimpleCollectionField = componentRequire('app/components/field-components/nemesis-collection-field/nemesis-simple-collection-field/nemesis-simple-collection-field', 'nemesis-simple-collection-field');
let NemesisEntityCollectionField = componentRequire('app/components/field-components/nemesis-collection-field/nemesis-entity-collection-field/nemesis-entity-collection-field', 'nemesis-entity-collection-field');

export default class EmbeddedCreationPortalQuickView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {entityFields: context.entityMarkupData[props.entityId].simpleView.mainViewItems};
    this.fieldsReferences = [];
  }

  componentDidMount() {
    this.fieldsReferences = [];
  }

  UNSAFE_componentWillUpdate() {
    this.fieldsReferences = [];
  }

  render() {
      return (
        <div style={{verticalAlign: 'top'}}>
          {_.map(this.state.entityFields, (item, key) => {
            return <div className={'paper-box with-hover nemesis-field-container' + this.getFieldStyle(item)} key={key}>{this.getSectionItemRenderer(item, key)}</div>
          })}
        </div>
    );
  }

  getSectionItemRenderer(item, index) {
    let reactElement;
    let itemName = item.name;
    let elementConfig = {
      mainEntity: this.props.entity,
      embeddedCreationAllowed: item.embeddedCreationAllowed,
      label: item.fieldLabel,
      name: itemName,
      readOnly: !item.updatable || !item.insertable,
      required: item.required,
      value: undefined,
      type: nemesisFieldUsageTypes.quickView,
      ref: (field) => { field && this.fieldsReferences.push(field)}
    };

    //Its some problem with injecting nemesis entity field in this file
    //the problem may come from that we try to inject the component here
    //but embedded-creation is inside the file with nemesis-entity-field
    if (!NemesisEntityField) {
      NemesisEntityField = componentRequire('app/components/field-components/nemesis-entity-field/nemesis-entity-field', 'nemesis-entity-field');
    }

    if (!NemesisEntityCollectionField) {
      NemesisEntityCollectionField = componentRequire('app/components/field-components/nemesis-collection-field/nemesis-entity-collection-field/nemesis-entity-collection-field', 'nemesis-entity-collection-field');
    }

    switch (item.xtype) {
      case nemesisFieldTypes.nemesisTextField: reactElement = NemesisTextField; break;
      case nemesisFieldTypes.nemesisTextarea: reactElement = NemesisTextareaField; break;
      case nemesisFieldTypes.nemesisXmlField: elementConfig.type='xml'; reactElement = NemesisCodeField; break;
      case nemesisFieldTypes.nemesisJavascriptField: elementConfig.type='text/javascript'; reactElement = NemesisCodeField; break;
      case nemesisFieldTypes.nemesisCssField: elementConfig.type='text/css'; reactElement = NemesisCodeField({type:'css'}); break;
      case nemesisFieldTypes.nemesisHtmlEditor: reactElement = NemesisRichTextField; break;
      case nemesisFieldTypes.nemesisPasswordField: reactElement = NemesisPasswordField; break;
      case nemesisFieldTypes.nemesisDateField: reactElement = NemesisDateField; break;
      case nemesisFieldTypes.nemesisDateTimeField: reactElement = NemesisDateTimeField; break;
      case nemesisFieldTypes.nemesisMoneyField: reactElement = NemesisMoneyField; break;
      case nemesisFieldTypes.nemesisDecimalField: elementConfig.step = '0.1'; reactElement = NemesisNumberField; break;
      case nemesisFieldTypes.nemesisIntegerField: reactElement = NemesisNumberField; break;
      case nemesisFieldTypes.nemesisBooleanField: reactElement = NemesisBooleanField; break;
      case nemesisFieldTypes.nemesisEnumField: elementConfig.values = item.values; elementConfig.value = item.values.indexOf(elementConfig.value); reactElement = NemesisEnumField; break;
      case nemesisFieldTypes.nemesisEntityField: elementConfig.entityId = item.entityId; elementConfig.onEntityItemClick= this.props.onEntityItemClick; reactElement = NemesisEntityField; break;
      case nemesisFieldTypes.nemesisBuildingBlockEntityField: elementConfig.entityId = item.entityId; elementConfig.onEntityItemClick= this.props.onEntityItemClick; reactElement = NemesisBuildingBlockEntityField; break;
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


  getFieldStyle(item) {
    if (item.embeddedCreationAllowed || item.xtype === nemesisFieldTypes.nemesisMapField) {
      return ' with-icon';
    }

    return '';
  }
}

EmbeddedCreationPortalQuickView.contextTypes = {
  markupData: PropTypes.object,
  entityMarkupData: PropTypes.object
};
