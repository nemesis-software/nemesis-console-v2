import React, { Component } from 'react';
import { componentRequire } from '../../utils/require-util';
import ApiCall from '../../services/api-call';
import counterpart from 'counterpart';
import _ from 'lodash';

let TreeItem = componentRequire('app/components/navigation-tree/navigation-tree-item', 'navigation-tree-item');

export default class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {treeData: [], filteredData: [], loadingData: true, filterContent: ''};
    this.selectedCreatingItem = null;
  }

  componentDidMount() {
    this.populateNavigationData();
  }

  render() {
    return (
      <div>
        <div className="navigation-filter">
          <input type="text"
                 placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                 className="navigation-filter-input"
                 value={this.state.filterContent}
                 disabled={this.props.readOnly}
                 onChange={this.onFilterChange.bind(this)}/>
          <i className="fa fa-search search-icon"/>
        </div>
        {this.state.loadingData ? <div>
          <div style={{textAlign: 'center'}} className="loading-text">Loading...</div>
          <div style={{textAlign: 'center'}}><i className="material-icons loading-icon" style={{fontSize: '30px', padding: '10px'}}>cached</i></div>

        </div> : false}
        {this.state.filteredData.map((item, index) => <TreeItem onEntityClick={this.props.onEntityClick}
                                                                initiallyOpen={this.state.filteredData.length !== this.state.treeData.length}
                                                                key={index}
                                                                item={item}
                                                                nestingLevel={0}
                                                                nestedItems={item.children || []}>
          <TreeItem/>
        </TreeItem>)}
      </div>
    )
  };

  onFilterChange(ev) {
    let actualFilterValue = ev.target.value;
    let filteredTreeItems = this.filterChildren(this.state.treeData, actualFilterValue);
    this.setState({...this.state, filteredData: filteredTreeItems, filterContent: actualFilterValue});
  }

  shouldComponentUpdate(nextProps, nextState) {
   if (_.isEqual(this.state, nextState)) {
     return false;
   }

   return true;
  }

  getNavigationData() {
    return ApiCall.get('backend/navigation', {root: 'backend_console'}).then(result => {
      this.setState({...this.state, loadingData: false});
      return result;
    }, err => {
      this.setState({...this.state, loadingData: false});
      return err;
    });
  }

  populateNavigationData() {
    this.getNavigationData().then(result => {
      this.setState({...this.state, treeData: result.data, filteredData: this.filterChildren(result.data, this.state.filterContent)});
    });
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