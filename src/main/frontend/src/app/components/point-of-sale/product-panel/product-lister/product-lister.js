import React, {Component} from 'react';

import ProductListerItem from './product-lister-item';

export default class ProductLister extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="product-lister">
        {this.props.products.map(product => <ProductListerItem onProductSelect={this.props.onProductSelect} key={product.id} product={product} />)}
      </div>
    )
  }
}