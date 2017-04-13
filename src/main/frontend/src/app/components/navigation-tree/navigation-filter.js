import React, { Component } from 'react';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

export default class NavigationFilter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TextField
        floatingLabelStyle={{color: 'white'}}
        inputStyle={{color: 'white'}}
        underlineFocusStyle={{borderColor: 'white'}}
        floatingLabelText={<Translate content={'main.Filter...'} fallback="Filter..." />}
        onChange={_.debounce(this.filterNavigationContent.bind(this), 250)}/>
    )
  }


  filterNavigationContent(event, value) {
    let filteredTreeItems = this.filterChildren(this.props.data, value);
    this.props.onFilterChange(filteredTreeItems);
  }

  filterChildren(arr, text) {
    if (!arr || arr.length === 0) {
      return [];
    }

    let result = [];
    let regex = new RegExp(text, 'i');
    arr.forEach(item => {
      let filteredChildren = this.filterChildren(item.children, text);
      if (filteredChildren.length > 0) {
        result.push({...item, children: filteredChildren});
      }

      if (item.leaf && regex.test(counterpart.translate('main.' + item.text))) {
        result.push(item);
      }
    });

    return result;
  }
}