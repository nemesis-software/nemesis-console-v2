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
        <PaymentMethods setIsPaymentProcess={this.props.setIsPaymentProcess}/>

      </div>
    )
  }
}