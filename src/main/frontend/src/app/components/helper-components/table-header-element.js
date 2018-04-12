import React, {Component} from 'react';
import Translate from 'react-translate-component';

import {nemesisFieldTypes} from '../../types/nemesis-types';

export default class TableHeaderElement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <th className="table-header-element">
        <Translate component="span" content={'main.' + this.props.markupItem.text} fallback={this.props.markupItem.text}/>
        {this.getOrderSymbols()}
      </th>
    )
  }

  getOrderSymbols() {
    if (this.props.markupItem.sortable && [nemesisFieldTypes.nemesisTextField, nemesisFieldTypes.nemesisDateTimeField, nemesisFieldTypes.nemesisBooleanField].indexOf(this.props.markupItem.type) > -1) {
      return (
        <span className="sort-icon-container">
          <i className={'fa fa-caret-up up-icon' + (this.isSortedField('asc'))} onClick={() => this.setOrder('asc')}/>
          <i className={'fa fa-caret-down down-icon'+ (this.isSortedField('desc'))} onClick={() => this.setOrder('desc')}/>
        </span>
      )
    }

    return false;
  }

  setOrder(orderType) {
    let sortObj = this.props.sortData[0];
    if (sortObj && sortObj.field === this.props.markupItem.name && sortObj.orderType === orderType) {
      return;
    }

    this.props.onSortDataChange([{field: this.props.markupItem.name, orderType: orderType}]);
  }

  isSortedField(orderType) {
    let sortObj = this.props.sortData[0];
    if (!sortObj) {
      return ''
    }

    if (sortObj.field === this.props.markupItem.name && sortObj.orderType === orderType) {
      return ' selected';
    }

    return '';
  }
}