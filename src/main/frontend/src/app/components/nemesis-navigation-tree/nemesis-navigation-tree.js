import React, { Component } from 'react';
import CONFIG from '../../../CONFIG'
import axios from 'axios';
import TreeItem from './nemesis-navigation-tree-item'
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';


export default class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {treeData: [], filteredData: []};
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

  render() {
    return (
      <div>
        <TextField
          floatingLabelText={<Translate content={'main.filter...'} fallback="Filter..." />}
          onChange={_.debounce(this.filterNavigationContent.bind(this), 250)}/>
        {this.state.filteredData.map((item, index) => <TreeItem initiallyOpen={this.state.filteredData.length !== this.state.treeData.length} key={index} item={item} nestingLevel={0} children={item.children || []} />)}
      </div>
    )
  };

  filterNavigationContent(event, value) {
    let filteredTreeItems = this.filterChildren(this.state.treeData, value);
    this.setState({...this.state, filteredData: filteredTreeItems});
  }

  filterChildren(arr, text) {
    let result = [];
    let regex = new RegExp(text, 'i');
    arr.forEach(item => {

      if (item.children && item.children.length > 0) {
        let filteredChildren = this.filterChildren(item.children, text);
        if (filteredChildren.length > 0) {
          result.push({...item, children: filteredChildren});
        }
      }
      if (item.leaf && regex.test(counterpart.translate('main.' + item.text))) {
        result.push(item);
      }
    });

    return result;
  }
}