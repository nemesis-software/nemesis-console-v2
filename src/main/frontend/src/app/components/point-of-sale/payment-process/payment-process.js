import React, {Component} from 'react';

import PaymentMethods from './payment-methods';

export default class PaymentProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="payment-process">
        <PaymentMethods onFinalizePayment={this.onFinalizePayment.bind(this)} totalPrice={this.props.cart.totalPrice} setIsPaymentProcess={this.props.setIsPaymentProcess}/>

      </div>
    )
  }

  onFinalizePayment(totalMoneyPayed) {

  }
}