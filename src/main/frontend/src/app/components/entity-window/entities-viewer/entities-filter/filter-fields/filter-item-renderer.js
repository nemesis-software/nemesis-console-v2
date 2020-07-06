import React, { Component } from 'react';
import PropTypes from "prop-types";
import {componentRequire} from "../../../../../utils/require-util";
import {nemesisFieldTypes} from "../../../../../types/nemesis-types";

let FilterTextField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-text-field/filter-text-field', 'filter-text-field');
let FilterDateTimeField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-date-time-field/filter-date-time-field', 'filter-date-time-field');
let FilterLocalizedTextField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-localized-text-field/filter-localized-text-field', '');
let FilterBooleanField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-boolean-field/filter-boolean-field', 'filter-boolean-field');
let FilterNumberField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-number-field/filter-number-field', 'filter-number-field');
let FilterEnumField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-enum-field/filter-enum-field', 'filter-enum-field');
let FilterEntityField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-entity-field/filter-entity-field', 'filter-entity-field');
let FilterCollectionField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-collection-field/filter-collection-field', 'filter-collection-field');
let FilterMoneyField = componentRequire('app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-money-field/filter-money-field', 'filter-money-field');

export default class FilterItemRenderer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.getFilterItemRender(this.props.filterItem)
  }

  getFilterItemRender(filterItem) {
    let reactElement;
    switch (filterItem.xtype) {
      case nemesisFieldTypes.nemesisTextField:
        reactElement = FilterTextField;
        break;
      case nemesisFieldTypes.nemesisDateTimeField:
        reactElement = FilterDateTimeField;
        break;
      case nemesisFieldTypes.nemesisLocalizedTextField:
        reactElement = FilterLocalizedTextField;
        break;
      case nemesisFieldTypes.nemesisBooleanField:
        reactElement = FilterBooleanField;
        break;
      case nemesisFieldTypes.nemesisEnumField:
        reactElement = FilterEnumField;
        break;
      case nemesisFieldTypes.nemesisIntegerField:
      case nemesisFieldTypes.nemesisDecimalField:
        reactElement = FilterNumberField;
        break;
      case nemesisFieldTypes.nemesisEntityField:
        reactElement = FilterEntityField;
        break;
      case nemesisFieldTypes.nemesisCollectionField:
        reactElement = FilterCollectionField;
        break;
      case nemesisFieldTypes.nemesisMoneyField:
        reactElement = FilterMoneyField;
        break;
      default:
        return <div>Not supported yet - {filterItem.xtype}</div>
    }

    return React.createElement(reactElement, {...this.props});
  }

}

FilterItemRenderer.propTypes = {
  filterItemKey: PropTypes.string,
  filterItem: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired
};
