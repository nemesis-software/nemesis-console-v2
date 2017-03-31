import React, { Component } from 'react';

import _ from 'lodash';

import Paper from 'material-ui/Paper';

import EntitiesPager from '../../app/components/entity-window/entities-viewer/entities-pager/entities-pager'


export default class CardViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {entitiesMarkup: this.props.entitiesMarkup || []};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...this.state, entitiesMarkup: nextProps.entitiesMarkup})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.state, nextState) && _.isEqual(this.props, nextProps));
  }

  render() {
    return (
      <div style={this.props.style}>
        <div><EntitiesPager onPagerChange={this.props.onPagerChange}  page={this.props.page}/></div>

        {
          this.props.entities.map((item, index) => {
            return (
              <div key={index} onClick={() => this.props.onEntityItemClick(item)} style={{width: 'calc(50% - 10px)', cursor: 'pointer', display: 'inline-block', padding: '5px'}}>
                <Paper  zDepth={1} >
                  {
                    this.state.entitiesMarkup.map((markupItem, index) => this.getRowItem(item, markupItem, index))
                  }
                </Paper>
              </div>
            )
          })
        }
      </div>
    )
  }


  getRowItem(item, markupItem, index) {
    let itemValue = item[markupItem.name];
    if (['nemesisLocalizedRichtextField', 'nemesisLocalizedTextField'].indexOf(markupItem.type) > -1) {
      itemValue = item[markupItem.name]['en'] && item[markupItem.name]['en'].value;
    }
    return (
      <div key={index} style={{padding: '3px'}}>{markupItem.name}: {itemValue || ''}</div>
    )
  }
}
