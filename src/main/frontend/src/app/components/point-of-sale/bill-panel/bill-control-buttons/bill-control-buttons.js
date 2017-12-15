import React, {Component} from 'react';

export default class BillControlButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bill-control-buttons">
        <div className="payment-process-button pos-button" onClick={() => this.props.setIsPaymentProcess(true)}>
          <div><i className="material-icons">attach_money</i></div>
          Payment
        </div>
        <div className="number-pad-container">
          <table>
            <tbody>
              <tr>
                <td className="number-buttons pos-button">1</td>
                <td className="number-buttons pos-button">2</td>
                <td className="number-buttons pos-button">3</td>
                <td className="pos-button" rowSpan={2}>Qty</td>
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
    )
  }
}