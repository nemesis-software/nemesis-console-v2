import React, { Component } from 'react';
import { searchRestrictionTypes } from '../../../../../types/nemesis-types';
import FilterRestrictionFields from '../filter-restriction-field/filter-restriction-field';
import DatePicker from 'material-ui/DatePicker';
import Translate from 'react-translate-component';
import moment from 'moment';

const restrictionFields = [
  searchRestrictionTypes.before,
  searchRestrictionTypes.after,
  searchRestrictionTypes.notNull,
  searchRestrictionTypes.isNull
];

const styles = {
  verticalAlign: 'top',
  marginRight: '10px'
};

export default class FilterDateField extends Component {
  constructor(props) {
    super(props);
    console.log(moment);
    this.state = {restrictionField: null, dateField: null};
  }

  render() {
    return (
      <div>
        <FilterRestrictionFields onRestrictionFieldChange={this.onRestrictionFieldChange.bind(this)} style={styles} restrictionFields={restrictionFields}/>
        <DatePicker style={this.getDateFieldStyles()}
                    onChange={this.onDateFieldChange.bind(this)}
                    floatingLabelText={<Translate content={'main.' + this.props.filterItem.fieldLabel} fallback={this.props.filterItem.fieldLabel} />} />
      </div>
    )
  }

  onRestrictionFieldChange(restrictionValue) {
    this.setState({...this.state, restrictionField: restrictionValue});
    this.updateParentFilter(this.state.dateField, restrictionValue);
  }

  onDateFieldChange(event, value) {
    let date = moment(value).set({hour:0,minute:0,second:0,millisecond:0}).format('Y-MM-DD\\THH:mm:ss');
    this.setState({...this.state, dateField: date});
    this.updateParentFilter(date, this.state.restrictionField);
  }

  updateParentFilter(dateField, restrictionValue) {
    this.props.onFilterChange({
      value: dateField,
      restriction: restrictionValue,
      field: this.props.filterItem.name
    });
  }

  getDateFieldStyles() {
    let result = {...styles};
    result.display = 'inline-block';
    if ([searchRestrictionTypes.notNull, searchRestrictionTypes.isNull].indexOf(this.state.restrictionField) > -1) {
      result.display = 'none';
    }

    return result;
  }
}