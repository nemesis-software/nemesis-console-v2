import React, {Component} from 'react';

import { nemesisFieldTypes, nemesisFieldUsageTypes } from '../../types/nemesis-types';

import SideBar from './additional-side-bar';

import { componentRequire } from '../../utils/require-util';

import LanguageChanger from '../language-changer';

import ApiCall from 'servicesDir/api-call';

import _ from 'lodash';

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
    this.state = {isSidebarOpened: false};
  }

  componentWillMount() {
    this.fieldsReferences = [];
  }

  componentWillUpdate() {
    this.fieldsReferences = [];
  }

  render() {
    return (
      <div className="role-entity-item-view">
        <div>
          <button onClick={() => {this.setState({...this.state, isSidebarOpened: true})}}>Open Sidebar</button>
          <button onClick={this.handleSaveButtonClick.bind(this)}>Save</button>
          <button onClick={() => this.props.closeSelectedEntityView(true)}>Close View</button>

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
          {_.map(this.props.entityFields.mainView, (item, key) => {
            return <div key={key}>{this.getSectionItemRenderer(item, key)}</div>
          })}
        </div>
        <SideBar isSidebarOpened={this.state.isSidebarOpened}
                 sideBar={this.props.entityFields.sideBar}
                 closeSidebar={() => {this.setState({...this.state, isSidebarOpened: false})}}
                 getSectionItemRenderer={this.getSectionItemRenderer.bind(this)}
        />
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


  resetDirtyStates() {
    this.fieldsReferences.forEach(field => {
      field.resetDirtyState();
    });
  }

  handleSaveButtonClick() {
    if (!this.isFieldsValid()) {
      return;
    }

    this.setState({...this.state, isDataLoading: true});

    let dirtyEntityProps = this.getDirtyValues();
    let resultObject = {};
    let mediaFields = [];
    dirtyEntityProps.forEach(prop => {
      if (prop.isMedia) {
        mediaFields.push(prop);
      } else {
        resultObject[prop.name] = prop.value;
      }
    });
    let restMethod = this.props.entityData.id ? 'patch' : 'post';
    let restUrl = this.props.entityData.id ? `${this.props.entityId}/${this.props.entityData.id}` : this.props.entityId;
    ApiCall[restMethod](restUrl, resultObject).then((result) => {
      //this.props.onUpdateEntitySearchView(this.props.entity);
      let itemId = this.props.entityData.id ? this.props.entityData.id : result.data.id;
      //this.props.openNotificationSnackbar('Entity successfully saved');
      this.resetDirtyStates();

      this.uploadMediaFile(itemId, mediaFields).then(() => {
        this.setState({...this.state, isDataLoading: false});
      });
    }, this.handleRequestError.bind(this));
  }

  uploadMediaFile(itemId, mediaFields) {
    if (!mediaFields || mediaFields.length === 0) {
      return Promise.resolve();
    }
    let data = new FormData();
    data.append('file', mediaFields[0].value);
    return ApiCall.post('upload/media/' + itemId, data, 'multipart/form-data').then(
      () => {
        //this.props.openNotificationSnackbar('File successfully uploaded');
        return Promise.resolve();
      },
      (err) => {
        this.handleRequestError(err);
        return Promise.resolve();
      });
  }

  handleRequestError(err) {
    console.log('err', err)
  }
}