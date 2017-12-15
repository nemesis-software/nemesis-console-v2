import React, {Component} from 'react';

import '../../../styles/pos.less';

import ApiCall from '../../services/api-call'
import {componentRequire} from '../../utils/require-util'

import _ from 'lodash';

import Translate from 'react-translate-component';
import BillPanel from './bill-panel/bill-panel';
import ProductPanel from './product-panel/product-panel';
import PaymentProcess from './payment-process/payment-process';

export default class PointOfSale extends Component {
  constructor(props) {
    super(props);
    this.state = {isPaymentProcess: false};
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="point-of-sale-container">
        <div style={this.getContainerStyles(this.state.isPaymentProcess)}>
          <BillPanel setIsPaymentProcess={this.setIsPaymentProcess.bind(this)}/>
          <ProductPanel/>
        </div>
        <div style={this.getContainerStyles(!this.state.isPaymentProcess)}>
          <PaymentProcess setIsPaymentProcess={this.setIsPaymentProcess.bind(this)}/>
        </div>
      </div>
    )
  }

  getContainerStyles(shouldBeHidden) {
    let style = {padding: '60px'};
    if (shouldBeHidden) {
      style.display = 'none';
    }

    return style;
  }

  setIsPaymentProcess(value) {
    this.setState({...this.state, isPaymentProcess: value});
  }
}