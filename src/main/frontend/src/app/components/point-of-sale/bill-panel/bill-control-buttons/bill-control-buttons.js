import React, {Component} from 'react';



export default class BillControlButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bill-control-buttons">
        <div className="payment-process-button">Payment</div>
        <div className="number-pad-container">
          <table>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td rowSpan={2}>Qty</td>
            </tr>
            <tr>
              <td>4</td>
              <td>5</td>
              <td>6</td>
            </tr>
            <tr>
              <td>7</td>
              <td>8</td>
              <td>9</td>
              <td rowSpan={2}>Back</td>
            </tr>
            <tr>
              <td colSpan={2}>0</td>
              <td>.</td>
            </tr>
          </table>
        </div>
      </div>
    )
  }
}