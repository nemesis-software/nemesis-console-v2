import React, {Component} from 'react';

import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import ApiCall from 'servicesDir/api-call';

import { nemesisFieldTypes, nemesisFieldUsageTypes } from '../../types/nemesis-types';

import _ from 'lodash';
import { componentRequire } from '../../utils/require-util';

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

export default class EmbeddedCreationPortal extends Component {
  constructor(props, context) {
    super(props, context);
    this.portalsContainer = document.querySelector('.portals-container');
    this.state = {entityFields: this.getEntityFields(), isLoading: false};
    this.fieldsReferences = [];
  }

  componentWillMount() {
    let body = document.querySelector('body');
    if (!body.classList.contains('overflow-portal')) {
      body.classList.add('overflow-portal');
    }
    this.fieldsReferences = [];
  }

  componentWillUnmount() {
    if (document.querySelectorAll('.embedded-creation-portal').length === 1) {
      let body = document.querySelector('body');
      body.classList.remove('overflow-portal');
    }
  }

  componentWillUpdate() {
    this.fieldsReferences = [];
  }

  render() {
    return ReactDOM.createPortal(
      (
        <div className="embedded-creation-portal">
          {this.state.isLoading ? <div className="loading-screen">
            <i className="material-icons loading-icon">cached</i>
          </div> : false}
          <div style={{verticalAlign: 'top'}}>
            {_.map(this.state.entityFields, (item, key) => {
              return <div className={'paper-box with-hover nemesis-field-container' + this.getFieldStyle(item)} key={key}>{this.getSectionItemRenderer(item, key)}</div>
            })}
          </div>
          <div className="portal-action-buttons-container">
            <button className="nemesis-button success-button" style={{marginRight: '15px'}} onClick={this.handleSaveButtonClick.bind(this)}>Save</button>
            <button className="nemesis-button decline-button" onClick={() => this.props.onCreationCancel()}>Cancel</button>
          </div>
        </div>

      ),
      this.portalsContainer
    );
  }

  getEntityFields() {
    let flattedFields = [];

    this.context.entityMarkupData[this.props.entityId].sections.forEach(section => {
      flattedFields = flattedFields.concat(section.items);
    });
    console.log(flattedFields);
    let config = this.context.quickViewData[this.props.entityId];

    let result = [];
    _.forEach(config.mainView, item => {
      let itemIndex = _.findIndex(flattedFields, (field) => {
        return field.name === item.name;
      });

      if (itemIndex > -1) {
        result.push({field: flattedFields[itemIndex], embeddedCreation: item.embeddedCreation});
      }
    });

    return result;
  }

  getSectionItemRenderer(item, index) {
    let reactElement;
    let itemName = item.field.name.replace('entity-', '');
    let elementConfig = {
      mainEntity: this.props.entity,
      embeddedCreation: item.embeddedCreation,
      label: item.field.fieldLabel,
      name: itemName,
      readOnly: item.field.readOnly,
      required: item.field.required,
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

    switch (item.field.xtype) {
      case nemesisFieldTypes.nemesisTextField: reactElement = NemesisTextField; break;
      case nemesisFieldTypes.nemesisTextarea: reactElement = NemesisTextareaField; break;
      case nemesisFieldTypes.nemesisHtmlEditor: reactElement = NemesisRichTextField; break;
      case nemesisFieldTypes.nemesisPasswordField: reactElement = NemesisPasswordField; break;
      case nemesisFieldTypes.nemesisDateField: reactElement = NemesisDateField; break;
      case nemesisFieldTypes.nemesisDateTimeField: reactElement = NemesisDateTimeField; break;
      case nemesisFieldTypes.nemesisDecimalField: elementConfig.step = '0.1'; reactElement = NemesisNumberField; break;
      case nemesisFieldTypes.nemesisIntegerField: reactElement = NemesisNumberField; break;
      case nemesisFieldTypes.nemesisBooleanField: reactElement = NemesisBooleanField; break;
      case nemesisFieldTypes.nemesisEnumField: elementConfig.values = item.field.values; elementConfig.value = item.field.values.indexOf(elementConfig.value); reactElement = NemesisEnumField; break;
      case nemesisFieldTypes.nemesisEntityField: elementConfig.entityId = item.field.entityId; elementConfig.onEntityItemClick= this.props.onEntityItemClick; reactElement = NemesisEntityField; break;
      case nemesisFieldTypes.nemesisLocalizedTextField: reactElement = NemesisSimpleLocalizedTextField; break;
      case nemesisFieldTypes.nemesisLocalizedRichtextField: reactElement = NemesisSimpleLocalizedRichTextField; break;
      case nemesisFieldTypes.nemesisColorpickerField: reactElement = NemesisColorpickerField; break;
      case nemesisFieldTypes.nemesisMediaField: reactElement = NemesisMediaField; break;
      case nemesisFieldTypes.nemesisMapField: reactElement = NemesisMapField; break;
      case nemesisFieldTypes.nemesisSimpleCollectionField: elementConfig.value = elementConfig.value || []; reactElement = NemesisSimpleCollectionField; break;
      case nemesisFieldTypes.nemesisCollectionField: elementConfig.onEntityItemClick= this.props.onEntityItemClick; elementConfig.entityId = item.field.entityId; elementConfig.value = elementConfig.value || []; reactElement = NemesisEntityCollectionField; break;
      default: return <div key={index}>Not supported yet - {item.field.xtype}</div>
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

  handleSaveButtonClick() {
    if (!this.isFieldsValid()) {
      return;
    }

    this.setState({...this.state, isLoading: true});

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
    ApiCall['post'](this.props.entityId, resultObject).then((result) => {
      this.uploadMediaFile(result.data.id, mediaFields).then(() => {
        this.setState({isLoading: false}, () => {
          this.props.onCreateEntity(result.data);
        });
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

  getFieldStyle(item) {
    if (item.embeddedCreation || item.field.xtype === nemesisFieldTypes.nemesisMapField) {
      return ' with-icon';
    }

    return '';
  }
}

EmbeddedCreationPortal.contextTypes = {
  markupData: PropTypes.object,
  entityMarkupData: PropTypes.object,
  quickViewData: PropTypes.object
};
