import React, {Component} from 'react';

export default class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  render() {
    return (
      <div className="payment-methods">
        <div className="payment-methods-header">
          <button onClick={() => this.props.setIsPaymentProcess(false)}>Back</button>
        </div>
        <div>
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
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="payment-keyboard">
              <table>
                <tbody>
                <tr>
                  <td className="number-buttons pos-button">1</td>
                  <td className="number-buttons pos-button">2</td>
                  <td className="number-buttons pos-button">3</td>
                  <td className="number-buttons pos-button" rowSpan={2}>C</td>
                </tr>
                <tr>
                  <td className="number-buttons pos-button">4</td>
                  <td className="number-buttons pos-button">5</td>
                  <td className="number-buttons pos-button">6</td>
                </tr>
                <tr>
                  <td className="number-buttons pos-button">7</td>
                  <td className="number-buttons pos-button">8</td>
                  <td className="number-buttons pos-button">9</td>
                  <td className="pos-button" rowSpan={2}><i className="material-icons">backspace</i></td>
                </tr>
                <tr>
                  <td className="number-buttons pos-button" colSpan={2}>0</td>
                  <td className="number-buttons pos-button">.</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}