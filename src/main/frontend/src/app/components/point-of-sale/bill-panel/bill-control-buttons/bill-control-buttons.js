import React, {Component} from 'react';

export default class BillControlButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bill-control-buttons">
        <div className="payment-process-button pos-button" onClick={() => this.props.onKeyboardButtonClick('payment')}>
          <div><i className="material-icons">attach_money</i></div>
          Payment
        </div>
        <div className="number-pad-container">
          <table>
            <tbody>
              <tr>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick(1)}>1</td>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick(2)}>2</td>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick(3)}>3</td>
                <td className="pos-button" rowSpan={2}>Qty</td>
              </tr>
              <tr>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick(4)}>4</td>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick(5)}>5</td>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick(6)}>6</td>
              </tr>
              <tr>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick(7)}>7</td>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick(8)}>8</td>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick(9)}>9</td>
                <td className="pos-button" rowSpan={2} onClick={() => this.props.onKeyboardButtonClick('delete')}><i className="material-icons">backspace</i></td>
              </tr>
              <tr>
                <td className="number-buttons pos-button" colSpan={2} onClick={() => this.props.onKeyboardButtonClick(0)}>0</td>
                <td className="number-buttons pos-button" onClick={() => this.props.onKeyboardButtonClick('dot')}>.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}