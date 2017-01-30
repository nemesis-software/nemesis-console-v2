import React, { Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Translate from 'react-translate-component';
import EntitiesPager from '../entities-pager/entities-pager';
import LanguageChanger from '../../../language-changer';
import _ from 'lodash';

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

    this.state = {entitiesMarkup: this.props.entitiesMarkup || [], selectedLanguage: 'en'};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...this.state, entitiesMarkup: nextProps.entitiesMarkup})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.state, nextState) && _.isEqual(this.props, nextProps));
  }

  render() {
    console.log(this.props, 'table renderer');
    return (
      <div>
        <Table selectable={true} onRowSelection={this.onRowSelected.bind(this)}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn colSpan={this.state.entitiesMarkup.length}>
                <LanguageChanger
                  onLanguageChange={this.onLanguageChange.bind(this)}
                  availableLanguages={translationLanguages.languages}
                  selectedLanguage={translationLanguages.defaultLanguage}
                />
                <EntitiesPager onPagerChange={this.props.onPagerChange}  page={this.props.page}/>
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              {
                this.state.entitiesMarkup.map((markupItem, index) => {
                  return (
                  <TableHeaderColumn key={index}>
                    <Translate component="span" content={'main.' + markupItem.text} fallback={markupItem.text}/>
                  </TableHeaderColumn>)
                })
              }
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {
              this.props.entities.map((item, index) => {
                return (
                  <TableRow key={index}>
                    {
                      this.state.entitiesMarkup.map((markupItem, index) => this.getTableRowColumnItem(item, markupItem, index))
                    }
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </div>
    )
  }

  getTableRowColumnItem(item, markupItem, index) {
    let itemValue = item[markupItem.name];
    if (['nemesisLocalizedRichtextField', 'nemesisLocalizedTextField'].indexOf(markupItem.type) > -1) {
      itemValue = item[markupItem.name][this.state.selectedLanguage] && item[markupItem.name][this.state.selectedLanguage].value;
    }
    return (
      <TableRowColumn style={{}} key={index}>
        {!!itemValue ? <Translate component="span" content={'main.' + itemValue} fallback={itemValue}/> : ''}
      </TableRowColumn>
    )
  }

  onLanguageChange(language) {
    this.setState({...this.state, selectedLanguage: language});
  }

  onRowSelected(event) {
    let item = this.props.entities[event[0]];
    if (item) {
      this.props.onEntityItemClick(item);
    }
  }
}