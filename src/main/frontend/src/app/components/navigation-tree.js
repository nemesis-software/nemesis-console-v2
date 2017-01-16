import React, { Component } from 'react';
import axios from 'axios';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CONFIG from '../../CONFIG'
import Translate from 'react-translate-component';

var self;
export default class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {treeData: [], filteredData: []};
    self = this;
  }

  componentWillMount() {
    let url = CONFIG.baseUrl + 'backend/navigation';
    let nemesisToken = document.getElementById('token').getAttribute('value');
    axios.get(url, {
      headers: {'X-Nemesis-Token': nemesisToken}
    }).then(result => {
      this.setState({treeData: result.data, filteredData: result.data});
      console.log(this.state);
    })
  }

  logger() {
    console.log('form base tree');
  }

  render() {
    this.logger();
    return (
      <List>
        <Subheader><Translate component="p" content="main.navigation"/></Subheader>
        {this.state.filteredData.map(this.listItemRenderer)}
      </List>
    );
  }

  listItemRenderer(item, index) {
    let children = item.children || item.childNodes;
    return (
      <ListItem
                key={index}
                primaryText={<Translate component="p" content={'main.' + item.text} />}
                primaryTogglesNestedList={true}
                nestedItems={children.map(self.listItemRenderer)}

      />
    );
  }
}