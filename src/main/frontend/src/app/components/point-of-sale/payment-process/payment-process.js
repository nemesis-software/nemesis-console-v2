import React, {Component} from 'react';

import PaymentMethods from './payment-methods';
import PaymentReceipt from './payment-receipt';

export default class PaymentProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {isFinalizePayment: false};
  }

  render() {
    return (
      <div className="payment-process">
        {this.state.isFinalizePayment ?
          <PaymentReceipt startNextOrder={this.props.startNextOrder} totalPayed={this.state.totalPayed} cart={this.props.cart}/> :
          <PaymentMethods onFinalizePayment={this.onFinalizePayment.bind(this)} totalPrice={this.props.cart.totalPrice}
                          setIsPaymentProcess={this.props.setIsPaymentProcess}/>
        }

      </div>
    )
  }

  onFinalizePayment(totalMoneyPayed) {
    this.setState({isFinalizePayment: true, totalPayed: totalMoneyPayed});
  }
}