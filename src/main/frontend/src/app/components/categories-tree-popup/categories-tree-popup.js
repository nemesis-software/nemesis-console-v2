import React, {Component} from 'react';

import Modal from 'react-bootstrap/lib/Modal';

import CategoryTreeItem from './category-tree-item';

import ApiCall from 'servicesDir/api-call';

import _ from 'lodash';

export default class CategoriesTreePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {categories: [], filteredCategories: [], selectedCategory: null, searchText: null, isDataLoading: true};
  }

  componentWillMount() {
    ApiCall.get('backend/categories').then(result => {
      let actualCategories = this.filterCategoriesForEntity(result.data, this.props.categoriesForEntity);
      this.setState({categories: actualCategories, filteredCategories: actualCategories, isDataLoading: false})
    })
  }

  render() {
    return (
      <Modal className="categories-tree-popup" bsSize="large" show={this.props.openPopup}>
        <Modal.Header>
          <Modal.Title>
            <div style={{textAlign: 'right', float: 'right', fontSize: '14px'}}>
              <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={() => this.props.handleCloseModal(null)}>Cancel</button>
              <button className="nemesis-button success-button" onClick={() => this.props.handleCloseModal(this.state.selectedCategory)}>Done</button>
            </div>
            <div>Select category</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.isDataLoading ? <div className="loading-screen">
            <i className="material-icons loading-icon">cached</i>
          </div> : false}
          <input type="text" className="search-field form-control" onChange={this.onFilterInputChange.bind(this)} value={this.state.searchText || ''} placeholder={'Highlight category'}/>
          {this.state.filteredCategories.map((item,index) => {
            return <CategoryTreeItem searchText={this.state.searchText} onSelectCategory={this.onSelectCategory.bind(this)} selectedCategory={this.state.selectedCategory} category={item} key={index} nestingLevel={0}><CategoryTreeItem/></CategoryTreeItem>
          })}
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={() => this.props.handleCloseModal(null)}>Cancel</button>
          <button className="nemesis-button success-button" onClick={() => this.props.handleCloseModal(this.state.selectedCategory)}>Done</button>
        </Modal.Footer>
      </Modal>
    )
  }

  filterCategoriesForEntity(categories, categoriesForEntity) {
    if (!categoriesForEntity || categoriesForEntity.length === 0) {
      return categories;
    }

    let result = [];

    categoriesForEntity.forEach(category => {
      let searchedIndex = _.findIndex(categories, {code: category});
      if (searchedIndex !== -1) {
        result = result.concat(categories[searchedIndex]);
      }
    });

    if (result.length === 0) {
      return categories;
    }

    return result;
  }

  onSelectCategory(category) {
    this.setState({selectedCategory: category});
  }

  onFilterInputChange(ev) {
    let value = ev.target.value;
    let categories = this.state.categories;
    let filteredCategories = [];
    if (value) {
      categories.forEach(category => {
        let hasMatchCategory = this.hasMatchSearchedCategory(category, value);
        if (hasMatchCategory) {
          filteredCategories.push(category);
        }
      });
    } else {
      filteredCategories = categories;
    }
    this.setState({searchText: value, filteredCategories: filteredCategories})
  }

  hasMatchSearchedCategory(category, searchValue) {
    let regex = new RegExp(searchValue, 'i');
    if (regex.test(category.code)) {
      return true;
    } else {
      let result = false;
      for (let i = 0; i < category.subcategories.length; i++) {
        result = this.hasMatchSearchedCategory(category.subcategories[i], searchValue);
        if (result) {
          break;
        }
      }

      return result;
    }
  }
}
