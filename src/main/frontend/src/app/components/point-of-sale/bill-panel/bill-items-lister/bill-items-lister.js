import React, {Component} from 'react';

import _ from 'lodash';

export default class BillItemsLister extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bill-items-lister">
        {this.props.cart.products.map(item => {
          return (
            <div key={item.product.id}>{item.product.name.en.value} Q: {item.quantity}</div>
          )
        })}
        Total price: {this.props.cart.totalPrice}$
      </div>
    )
  }
}
