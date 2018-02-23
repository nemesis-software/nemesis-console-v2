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
            <div className={'bill-lister-item' + (this.props.selectedProductId === item.product.id ? ' selected' : '')}
                 onClick={() => this.props.onBillItemClick(item.product.id)}
                 key={item.product.id}>
              <div className="bill-lister-item-name">{productName(item.product)}</div>
              <div className="bill-lister-item-calculations">
                <div className="bill-lister-item-total">{totalPrice(item)} $</div>
                <div className="bill-lister-item-units"><span className="bill-lister-item-quantity">{item.quantity}</span> Unit(s) at
                  $ {productPrice(item.product)} / Unit
                </div>
              </div>
            </div>
          )
        })}
        {this.props.cart.products.length === 0 ?
          <div className="bill-empty-cart">Your shopping cart is empty</div> :
          <div className="bill-item-lister-total-price"><span>Total price: {this.props.cart.totalPrice}$</span></div>
        }
      </div>
    )
  }
}

const productPrice = (product) => {
  let price = Number(product.price.split(',')[0]);

  return price.toFixed(2);
};

const totalPrice = (item) => {
  let itemPrice = Number(item.product.price.split(',')[0]);
  let result = item.quantity * itemPrice;
  return Number(result).toFixed(2);
};

const productName = (product) => {
  if (product.name && product.name.en) {
    return product.name.en.value;
  }

  return product.code;
};
