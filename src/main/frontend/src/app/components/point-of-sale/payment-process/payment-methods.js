import React, {Component} from 'react';

export default class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {payedAmount: ''};
  }

  render() {
    return (
      <div className="payment-methods">
        <div className="payment-methods-header">
          <div className="pos-button back-button" onClick={() => this.props.setIsPaymentProcess(false)}>Back</div>
          <div className="payment-methods-header-text">Payment</div>
          <div className="pos-button validate-button" onClick={() => this.props.onFinalizePayment(this.getActualAmountValue())}>Validate</div>
        </div>
        <div style={{height: '100%'}}>
          <div className="payment-types">
            <div className="payment-type pos-button">Cash (USD)</div>
            <div className="payment-type pos-button">Credit card</div>
            <div className="payment-type pos-button">Voucher</div>
          </div>
          <div className="payment-calculator">
            <div className="payment-calculation">
              <table>
                <thead>
                  <tr>
                    <th>Due</th>
                    <th>Tendered</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                  <td className="blue-td">{this.props.totalPrice} $</td>
                  <td className="payed-number">{this.getActualAmountValue()} $</td>
                  <td className="blue-td">{this.getChangeValue()}</td>
                </tr>
                <tr>
                  <td colSpan="3">{this.getRemainingToPay()}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="payment-keyboard">
              <table>
                <tbody>
                <tr>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick(1)}>1</td>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick(2)}>2</td>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick(3)}>3</td>
                  <td className="number-buttons pos-button" rowSpan={2} onClick={() => this.onKeyboardButtonClick('clear')}>C</td>
                </tr>
                <tr>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick(4)}>4</td>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick(5)}>5</td>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick(6)}>6</td>
                </tr>
                <tr>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick(7)}>7</td>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick(8)}>8</td>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick(9)}>9</td>
                  <td className="pos-button" rowSpan={2} onClick={() => this.onKeyboardButtonClick('delete')}><i className="material-icons">backspace</i></td>
                </tr>
                <tr>
                  <td className="number-buttons pos-button" colSpan={2} onClick={() => this.onKeyboardButtonClick(0)}>0</td>
                  <td className="number-buttons pos-button" onClick={() => this.onKeyboardButtonClick('dot')}>.</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onKeyboardButtonClick(value) {
    if (value === 'clear') {
      this.setState({...this.state, payedAmount: ''});
      return;
    }
    console.log('here');
    if (value === 'delete' && this.state.payedAmount.length > 0) {
      let amountActual = this.state.payedAmount;
      amountActual = amountActual.substring(0, amountActual.length - 1);
      console.log(amountActual);
      this.setState({...this.state, payedAmount: amountActual});
      return;
    }

    if (value === 'dot' && this.state.payedAmount.indexOf('.') === -1) {
      let amountActual = this.state.payedAmount;
      if (amountActual.length > 0) {
        amountActual += '.';
      } else {
        amountActual += '0.';
      }
      this.setState({...this.state, payedAmount: amountActual});
      return;
    }

    if (isFinite(value)) {
      let amountActual = this.state.payedAmount;
      if (amountActual.indexOf('.') === -1) {
        amountActual += value;
        this.setState({...this.state, payedAmount: amountActual});
      } else if (amountActual.split('.')[1].length < 2) {
        amountActual += value;
        this.setState({...this.state, payedAmount: amountActual});
      }
    }
  }

  getActualAmountValue() {
    return Number(this.state.payedAmount).toFixed(2);
  }

  getChangeValue() {
    if ( this.getActualAmountValue() - this.props.totalPrice >= 0) {
      return Number(this.getActualAmountValue() - this.props.totalPrice).toFixed(2) + ' $';
    }

    return false;
  }

  getRemainingToPay() {
    if ( this.props.totalPrice - this.getActualAmountValue() > 0) {
      return Number(this.props.totalPrice - this.getActualAmountValue()).toFixed(2) + ' $';
    }

    return false;
  }
}