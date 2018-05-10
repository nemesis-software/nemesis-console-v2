import React from 'react';
import NemesisEntityCollectionField from '../nemesis-entity-collection-field/nemesis-entity-collection-field';

import CategoriesTreePopup from '../../../categories-tree-popup/categories-tree-popup';

export default class NemesisCategoriesEntityCollectionField extends NemesisEntityCollectionField {
  constructor(props) {
    super(props);
    this.state = {...this.state, openCategoriesTree: false};
  }

  getAdditionalIconFunctionality() {
    return (
      <React.Fragment>
        {super.getAdditionalIconFunctionality()}
        <i className={'material-icons entity-navigation-icon'} onClick={this.openCategoriesTree.bind(this)}>reorder</i>
        {this.state.openCategoriesTree ? <CategoriesTreePopup categoriesForEntity={this.getCategoriesForEntity()} handleCloseModal={this.handleModalClose.bind(this)} openPopup={this.state.openCategoriesTree}/> : false}
      </React.Fragment>
    )
  }

  getCategoriesForEntity() {
    return [];
  }

  openCategoriesTree() {
    this.setState({openCategoriesTree: true});
  }

  handleModalClose(category) {
    if (category) {
      let valueActual = this.state.value || [];
      valueActual.push(category);
      this.setState({...this.state, isDirty: true, value: valueActual, openCategoriesTree: false});
    } else {
      this.setState({openCategoriesTree: false});
    }
  }
}