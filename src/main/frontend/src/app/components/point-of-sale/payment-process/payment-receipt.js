import React, {Component} from 'react';

export default class PaymentReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="payment-receipt-container">
        <div className="payment-receipt-header">
          <div className="payment-receipt-header-text">Change $ {changePrice(this.props.cart.totalPrice, this.props.totalPayed)}</div>
          <div className="pos-button next-order-button" onClick={() => this.props.onFinalizePayment(this.state.payedAmount)}>Next Order</div>
        </div>
        <div className="payment-receipt">
          <div className="payment-receipt-date">

          </div>
          <div className="payment-receipt-organization">
            <div>Store Company</div>
            <div>Phone: +123 000 000 000</div>
            <div>User: Seller1</div>
          </div>
          <div className="payment-receipt-content">
            <table>
              <tbody>
              {this.props.cart.products.map(item => {
                return (
                  <tr key={item.product.id}>
                    <td>{productName(item.product)}</td>
                    <td>{item.quantity}</td>
                    <td>$ {totalPrice(item)}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
          <div className="payment-receipt-finalization">
            <table>
              <tbody>
              <tr>
                <td>Total: </td>
                <td>$ {this.props.cart.totalPrice}</td>
              </tr>
              <tr>
                <td>Cash (USD): </td>
                <td>$ {this.props.totalPayed}</td>
              </tr>
              <tr>
                <td>Change: </td>
                <td>$ {changePrice(this.props.cart.totalPrice, this.props.totalPayed)}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

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

const changePrice = (totalPrice, totalPayed) => {
  return Number(Number(totalPayed).toFixed(2) - Number(totalPrice).toFixed(2)).toFixed(2);
};