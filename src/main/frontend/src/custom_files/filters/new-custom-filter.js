import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import FilterTextField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-text-field/filter-text-field'
import FilterDateField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-date-field/filter-date-field'
import FilterLocalizedTextField from '../../app/components/entity-window/entities-viewer/entities-filter/filter-fields/filter-localized-text-field/filter-localized-text-field'
import { searchRestrictionTypes } from '../../app/types/nemesis-types';
import BaseCustomFilter from './base-custom-filter';

export default class CustomFilter extends BaseCustomFilter {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style}>
        <FilterTextField readOnly={true} defaultRestriction={searchRestrictionTypes.startingWith} defaultValue={'women'} onFilterChange={this.onFilterChange.bind(this)} filterItem={{name: 'code', fieldLabel: 'Code'}} />
        <FilterDateField readOnly={true} defaultRestriction={searchRestrictionTypes.after} defaultValue={'2016-11-20T00:00:00'} onFilterChange={this.onFilterChange.bind(this)} filterItem={{name: 'lastModifiedDate', fieldLabel: 'Last modified'}} />
        <FilterLocalizedTextField readOnly={true} defaultLanguage={{value: 'bg_BG', labelCode: 'Bulgarian'}} defaultRestriction={searchRestrictionTypes.endingWith} defaultValue={{language: 'bg_BG', value: 'ни'}} onFilterChange={this.onFilterChange.bind(this)} filterItem={{name: 'name', fieldLabel: 'Name'}} />
        <div style={{padding: '10px 0'}} ><RaisedButton style={{margin: '10px'}} label="Search" onClick={this.onSearchButtonClick.bind(this)} /></div>
      </div>
    )
  }
}
