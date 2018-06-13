import React, {Component} from 'react';

import Translate from 'react-translate-component';
import {nemesisFieldTypes} from "../../types/nemesis-types";
import SimpleComparator from "./comparators/simple-comparator";
import EntityComparator from "./comparators/entity-comparator";
import CollectionComparator from "./comparators/collection-comparator";
import LocalizedComparator from "./comparators/localized-comparator";

export default class EntityFieldComparator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div><Translate component="label" content={'main.' + this.props.field.fieldLabel} fallback={this.props.field.fieldLabel}/></div>
        {this.getComparator(this.props.field.xtype)}
      </div>
    )
  }

  getComparator(itemType) {
    switch (itemType) {
      case nemesisFieldTypes.nemesisPasswordField:
      case nemesisFieldTypes.nemesisDecimalField:
      case nemesisFieldTypes.nemesisDateField:
      case nemesisFieldTypes.nemesisDateTimeField:
      case nemesisFieldTypes.nemesisIntegerField:
      case nemesisFieldTypes.nemesisBooleanField:
      case nemesisFieldTypes.nemesisEnumField:
      case nemesisFieldTypes.nemesisTextField:
      case nemesisFieldTypes.nemesisTextarea:
      case nemesisFieldTypes.nemesisJavascriptField:
      case nemesisFieldTypes.nemesisMapField:
      case nemesisFieldTypes.nemesisColorpickerField:
      case nemesisFieldTypes.nemesisMediaField:
      case nemesisFieldTypes.nemesisHtmlEditor: return <SimpleComparator {...this.props}/>;
      case nemesisFieldTypes.nemesisEntityField: return <EntityComparator  {...this.props}/>;
      case nemesisFieldTypes.nemesisLocalizedTextField:
      case nemesisFieldTypes.nemesisLocalizedRichtextField: return <LocalizedComparator  {...this.props}/>;
      case nemesisFieldTypes.nemesisCollectionField:
      case nemesisFieldTypes.nemesisProjectionCollection:
      case nemesisFieldTypes.nemesisCategoriesCollection:
      case nemesisFieldTypes.nemesisSimpleCollectionField: return <CollectionComparator  {...this.props}/>;
      default: return <SimpleComparator {...this.props}/>;
    }
  }



}
