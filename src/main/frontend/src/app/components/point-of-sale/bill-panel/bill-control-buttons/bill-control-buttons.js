import React, {Component} from 'react';



export default class BillControlButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bill-control-buttons">
        <div className="payment-process-button">
          <div><i className="material-icons">attach_money</i></div>
          Payment
        </div>
        <div className="number-pad-container">
          <table>
            <tr>
              <td className="number-buttons">1</td>
              <td className="number-buttons">2</td>
              <td className="number-buttons">3</td>
              <td rowSpan={2}>Qty</td>
            </tr>
            <tr>
              <td className="number-buttons">4</td>
              <td className="number-buttons">5</td>
              <td className="number-buttons">6</td>
            </tr>
            <tr>
              <td className="number-buttons">7</td>
              <td className="number-buttons">8</td>
              <td className="number-buttons">9</td>
              <td rowSpan={2}><i className="material-icons">backspace</i></td>
            </tr>
            <tr>
              <td  className="number-buttons" colSpan={2}>0</td>
              <td className="number-buttons">.</td>
            </tr>
          </table>
        </div>
      </div>
    )
  }
}