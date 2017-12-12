import React, {Component} from 'react';

import ProductLister from './product-lister/product-lister';

export default class ProductPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="product-panel-container">
        <ProductLister/>
      </div>
    )
  }
}