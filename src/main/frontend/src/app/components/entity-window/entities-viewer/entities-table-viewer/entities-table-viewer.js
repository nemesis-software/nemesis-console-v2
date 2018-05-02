import React, { Component } from 'react';

import _ from 'lodash';

import { componentRequire } from '../../../../utils/require-util';
import TableHeaderElement from "../../../helper-components/table-header-element";

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

    this.state = {entitiesMarkup: this.props.entitiesMarkup || [], selectedLanguage: translationLanguages.defaultLanguage.value};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...this.state, entitiesMarkup: nextProps.entitiesMarkup})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.state, nextState) && _.isEqual(this.props, nextProps));
  }

  render() {
    console.log(this.props.page);
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
              </th>
            </tr>
            <tr className="content-header">
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
                <tr style={{cursor: 'pointer'}} onClick={() => this.props.onEntityItemClick(item)} key={index}>
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
              <EntitiesPager onPagerChange={this.props.onPagerChange}  page={this.props.page}/>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    )
  }

  getTableRowColumnItem(item, markupItem, index) {
    let itemValue = item[markupItem.name];
    if (['nemesisLocalizedRichtextField', 'nemesisLocalizedTextField'].indexOf(markupItem.type) > -1) {
      itemValue = item[markupItem.name][this.state.selectedLanguage] && item[markupItem.name][this.state.selectedLanguage].value;
    }
    itemValue = isFinite(itemValue) && itemValue !== null ? itemValue + '' : itemValue;
    itemValue = (typeof itemValue === 'object' && itemValue !== null) ? JSON.stringify(itemValue) : itemValue;


    let style = {
      maxWidth: '100px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    };

    return (
      <td style={style} key={index}>{itemValue || ''}</td>
    )
  }

  onLanguageChange(language) {
    this.setState({...this.state, selectedLanguage: language});
  }
}