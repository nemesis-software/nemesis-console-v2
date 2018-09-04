import React, { Component } from 'react';

import _ from 'lodash';

import { componentRequire } from '../../../../utils/require-util';
import TableHeaderElement from "../../../helper-components/table-header-element";
import SyncStateTableRenderer from "../../../helper-components/sync-states-table-renderer";
import SelectEntityTableRenderer from "../../../helper-components/select-entity-table-renderer";
import {entityBulkEdit} from "../../../../types/entity-types";
import ApiCall from "../../../../services/api-call";

let EntitiesPager = componentRequire('app/components/entity-window/entities-viewer/entities-pager/entities-pager', 'entities-pager');
let LanguageChanger = componentRequire('app/components/language-changer', 'language-changer');

const translationLanguages = {
  languages: [
    {value: 'en', labelCode: 'English'},
    {value: 'bg_BG', labelCode: 'Bulgarian'},
  ],
  defaultLanguage: {value: 'en', labelCode: 'English'}
};

export default class EntitiesTableViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {entitiesMarkup: this.props.entitiesMarkup || [], selectedLanguage: translationLanguages.defaultLanguage.value, selectedIds: {}, isSelectedActive: false};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...this.state, entitiesMarkup: nextProps.entitiesMarkup})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.state, nextState) && _.isEqual(this.props, nextProps));
  }

  render() {
    return (
      <div style={this.props.style} className="entities-table-viewer">
        <table>
          <thead>
            <tr className="navigation-header">
              <th colSpan={this.state.entitiesMarkup.length}>
                <LanguageChanger
                  label="language"
                  onLanguageChange={this.onLanguageChange.bind(this)}
                  availableLanguages={translationLanguages.languages}
                  selectedLanguage={translationLanguages.defaultLanguage}
                />
                <EntitiesPager onPagerChange={this.props.onPagerChange} page={this.props.page}/>
                <div className="total-elements"><label>Total elements</label> <div className="total-element-container">{this.props.page.totalElements}</div></div>
                <button className="nemesis-button success-button select-button" onClick={this.onSelectButtonClick.bind(this)}>Select</button>
              </th>
            </tr>
            {this.state.isSelectedActive ? <tr>
              <th style={{paddingBottom: '20px'}} colSpan={this.state.entitiesMarkup.length}>
                <div className="selected-elements"><label>Selected elements</label> <div className="total-selected-container">{Object.keys(this.state.selectedIds).length}</div></div>
                {this.getBulkButtons()}
              </th>
            </tr> : false}
            <tr className="content-header">
              {this.state.isSelectedActive ? <th className="table-header-element" style={{width: '60px'}}>
                <input type="checkbox" style={{background: 'white'}} className={"select-entity-checkbox nemesis-checkbox"} onChange={this.markAllAsSelected.bind(this)}/>
              </th> : false}
              {
                this.state.entitiesMarkup.map((markupItem, index) => {
                  return (
                    <TableHeaderElement  key={index} markupItem={markupItem} onSortDataChange={this.props.onSortDataChange} sortData={this.props.sortData}/>
                )})
              }
            </tr>
          </thead>
          <tbody>
          {
            this.props.entities.map((item, index) => {
              return (
                <tr style={{cursor: 'pointer'}} onClick={(ev) => this.onRowClick(ev, item)} key={index}>
                  {this.state.isSelectedActive ? <SelectEntityTableRenderer key={index} id={item.id} selectedIds={this.state.selectedIds} onSelectedIdsChange={this.onSelectedIdsChange.bind(this)}/> : false}
                  {
                    this.state.entitiesMarkup.map((markupItem, index) => this.getTableRowColumnItem(item, markupItem, index))
                  }
                </tr>
              )
            })
          }
          </tbody>
          <tfoot>
          <tr className="navigation-footer">
            <td colSpan={this.state.entitiesMarkup.length}>
              <EntitiesPager onPagerChange={this.props.onPagerChange} page={this.props.page}/>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    )
  }

  onBulkEditClick() {
    this.props.onEntityItemClick({entityName: this.props.entityId}, this.props.entityId , null, entityBulkEdit, Object.keys(this.state.selectedIds));
  }

  onExportClick() {
    if (_.isEmpty(this.state.selectedIds)) {
      return;
    }
    let locale = this.state.selectedLanguage === 'en' ? 'en_US' : 'bg_BG';
    ApiCall.post('backend/export-excel', null, null, {entityName: this.props.entityId, ids: Object.keys(this.state.selectedIds).join(','), locale: locale}).then(result => {
      let csvContent = "data:text/csv;charset=utf-8," + result.data;
      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      let fileName = `exported_data_${new Date().getTime()}.csv`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
  }

  getBulkButtons() {
    return (
      <React.Fragment>
        <button className="nemesis-button success-button bulk-button" onClick={this.onBulkEditClick.bind(this)}>Bulk Edit</button>
        <button className="nemesis-button success-button bulk-button" onClick={this.onExportClick.bind(this)}>Export</button>
      </React.Fragment>
    )
  }

  markAllAsSelected() {
    let result = {...this.state.selectedIds};
    this.props.entities.forEach(item => {
      result[item.id] = true;
    });

    this.setState({selectedIds: result});
  }

  onSelectedIdsChange(value) {
    this.setState({selectedIds: value});
  }

  onSelectButtonClick() {
    this.setState({selectedIds: {}, isSelectedActive: !this.state.isSelectedActive});
  }

  onRowClick(ev, item) {
    if (ev.target.classList.contains('status-dot') || ev.target.classList.contains('select-entity-checkbox')) {
      return;
    }
    this.props.onEntityItemClick(item);
  }

  getTableRowColumnItem(item, markupItem, index) {
    let style = {
      maxWidth: '100px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    };

    if (markupItem.name === 'syncStates') {
      return (
        <SyncStateTableRenderer style={style} value={item.syncStates} key={index}/>
      )
    }
    let itemValue = item[markupItem.name];
    if (['nemesisLocalizedRichtextField', 'nemesisLocalizedTextField'].indexOf(markupItem.type) > -1) {
      itemValue = item[markupItem.name][this.state.selectedLanguage] && item[markupItem.name][this.state.selectedLanguage].value;
    }
    itemValue = isFinite(itemValue) && itemValue !== null ? itemValue + '' : itemValue;
    itemValue = (typeof itemValue === 'object' && itemValue !== null) ? JSON.stringify(itemValue) : itemValue;

    return (
      <td style={style} key={index}>{itemValue || ''}</td>
    )
  }

  onLanguageChange(language) {
    this.setState({...this.state, selectedLanguage: language});
  }
}