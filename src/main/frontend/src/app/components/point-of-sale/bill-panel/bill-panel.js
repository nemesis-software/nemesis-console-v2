import React, {Component} from 'react';

import BillItemsLister from './bill-items-lister/bill-items-lister';
import BillControlButtons from './bill-control-buttons/bill-control-buttons';

export default class BillPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bill-panel-container">
        <BillItemsLister cart={this.props.cart}/>
        <BillControlButtons setIsPaymentProcess={this.props.setIsPaymentProcess}/>
      </div>
    )
  }
}