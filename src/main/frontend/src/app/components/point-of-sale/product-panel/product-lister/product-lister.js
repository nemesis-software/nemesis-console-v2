import React, {Component} from 'react';

import ProductListerItem from './product-lister-item';

export default class ProductLister extends Component {
  constructor(props) {
    super(props);
    this.state = {products: this.generateProducts()};
  }

  render() {
    return (
      <div className="product-lister">
        {this.state.products.map(product => <ProductListerItem product={product} />)}
      </div>
    )
  }

  generateProducts() {
    let result = [];
    for (let i = 0; i < 50; i++) {
      result.push(
        {
          name: 'test product ' + i,
          img: 'resources/no-img.png',
          price: Math.round((0.34 * i + 1) * 100) / 100,
          id: i
        }
      )
    }

    return result;
  }
}