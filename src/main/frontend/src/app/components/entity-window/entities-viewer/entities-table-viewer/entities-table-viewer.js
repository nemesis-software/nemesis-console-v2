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
const tableMode = 'TABLE_MODE';
const imageMode = 'IMAGE_MODE';

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
    this.state = {entitiesMarkup: this.props.entitiesMarkup || [], selectedLanguage: translationLanguages.defaultLanguage.value, selectedIds: {}, isSelectedActive: false, viewMode: tableMode, showRestButton: false, isAllSelected:false};

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
              <th colSpan={this.state.entitiesMarkup.length} className="navigation-actions" >
                <LanguageChanger
                  label="language"
                  onLanguageChange={this.onLanguageChange.bind(this)}
                  availableLanguages={translationLanguages.languages}
                  selectedLanguage={translationLanguages.defaultLanguage}
                />
                <EntitiesPager onPagerChange={this.props.onPagerChange} page={this.props.page}/>
                <div className="total-elements"><label>Total elements</label> <div className="total-element-container">{this.props.page.totalElements}</div></div>
                <button className="nemesis-button success-button select-button" onClick={this.onSelectButtonClick.bind(this)}>Select</button>
                <div className="view-switcher">
                  <div className="view-switcher-icon-container"><i className="material-icons" onClick={() => this.setState({viewMode: tableMode})}>view_list</i></div>
                  <div className="view-switcher-icon-container"><i style={{fontSize: '40px', position: 'absolute'}} className="material-icons" onClick={() => this.setState({viewMode: imageMode})}>view_module</i></div>
                </div>
                <div className="rest-container" >
                  <i className="fa fa-link rest-navigation rest-button" title="Open rest" onClick={this.openRest.bind(this)} />
                </div>
              </th>
            </tr>
            {this.state.isSelectedActive ? <tr>
              <th style={{paddingBottom: '20px'}} colSpan={this.state.entitiesMarkup.length}>
                <div className="selected-elements"><label>Selected elements</label> <div className="total-selected-container">{Object.keys(this.state.selectedIds).length}</div></div>
                {this.getBulkButtons()}
              </th>
            </tr> : false}
            {this.state.viewMode === tableMode ? <tr className="content-header">
              {this.state.isSelectedActive ? <th className="table-header-element" style={{width: '60px'}}>
                <input type="checkbox" style={{background: 'white'}} className={`select-entity-checkbox nemesis-checkbox ${this.state.isAllSelected ? "active" : ""}`} onChange={this.markAllAsSelected.bind(this)}/>

              </th> : false}
              {
                this.state.entitiesMarkup.map((markupItem, index) => {
                  return (
                    <TableHeaderElement  key={index} markupItem={markupItem} onSortDataChange={this.props.onSortDataChange} sortData={this.props.sortData}/>
                )})
              }
            </tr> : false}
          </thead>
          <tbody>
          {this.state.viewMode === tableMode ?
            this.props.entities.map((item, index) => {
              return (
                <tr style={{cursor: 'pointer'}} onClick={(ev) => this.onRowClick(ev, item)} key={index}>
                  {this.state.isSelectedActive ?
                  <td className="select-entity-table-renderer">
                    <SelectEntityTableRenderer key={index} id={item.id} selectedIds={this.state.selectedIds} onSelectedIdsChange={this.onSelectedIdsChange.bind(this)}/>
                  </td>: false}
                  {
                    this.state.entitiesMarkup.map((markupItem, index) => this.getTableRowColumnItem(item, markupItem, index))
                  }
                </tr>
              )
            }) : false}
          {this.state.viewMode === imageMode ?
            <tr className="image-mode-tr">
              <td>
              {this.props.entities.map((item, index) => {
                return (
                  <div className="image-view-item-container" key={index}>
                    <div className="image-view-image-container"><img src={item.picture ? item.picture : 'resources/no-img.png'}/></div>
                    <div className="text-container">{item.code}</div>
                    {item.catalogVersion ? <div className="text-container">{item.catalogVersion}</div> : false}
                    <div className="image-view-icon-container sync-state-container">
                      {item.syncStates ? <SyncStateTableRenderer value={item.syncStates}/> : false}
                      <i className={'material-icons entity-navigation-icon'} onClick={() => this.props.onEntityItemClick(item)}>launch</i>
                      {this.state.isSelectedActive ? <SelectEntityTableRenderer id={item.id} selectedIds={this.state.selectedIds} onSelectedIdsChange={this.onSelectedIdsChange.bind(this)}/> : false}
                    </div>
                  </div>
                )
              })}
              </td>
            </tr>
            : false}
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
  	if(!this.state.isAllSelected) {
      let result = {...this.state.selectedIds};
      this.props.entities.forEach(item => {
        result[item.id] = true;
      });
      this.setState(prevState => ({...prevState, selectedIds: result, isAllSelected: true}));
	  }else{
      let result = {...this.state.selectedIds};
      this.props.entities.forEach(item => {
        result[item.id] = false;
      });
      this.setState(prevState => ({...prevState, selectedIds: {}, isAllSelected: false}));
  	}
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
        <td style={style} className="sync-state-container" key={index}>
          <SyncStateTableRenderer value={item.syncStates}/>
        </td>
      )
    }
    if (markupItem.name === 'picture') {
        let itemValue = item[markupItem.name];
        return (
          <td style={style} key={index}><img src={itemValue || 'resources/no-img.png'} className="picture" height="50px"/></td>
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

  openRest() {
    window.open(this.props.restUrl, '_blank')
  }
}