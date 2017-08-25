import React, { Component } from 'react';
import counterpart from 'counterpart';

export default class NavigationFilter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="navigation-filter">
      <input type="text"
             placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
             className="navigation-filter-input"
             disabled={this.props.readOnly}
             onChange={this.filterNavigationContent.bind(this)}/>
      <i className="fa fa-search search-icon"/>
    </div>
    )
  }


  filterNavigationContent(event) {
    let filteredTreeItems = this.filterChildren(this.props.data, event.target.value);
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