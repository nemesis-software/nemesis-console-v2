import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/groovy/groovy';

const codeMirrorOptions = {
  lineNumbers: true,
  mode: 'groovy'
};

export default class AdminInsertScript extends Component {
  constructor(props) {
    super(props);

    this.state = {value: ''};
  }
  
  render() {
    return (
      <div>
        <div>
          <button className="nemesis-button success-button" style={{marginBottom: '5px'}} onClick={this.insertScript.bind(this)}>Execute script</button>
        </div>
        <CodeMirror onChange={code => this.setState({...this.state, value: code})} value={this.state.value}  options={codeMirrorOptions}/>
      </div>
    );
  }

  insertScript() {
    if (!this.state.value) {
      return;
    }

    return PlatformApiCall.post('script', {script: this.state.value}).then(
      () => {
        this.props.openNotificationSnackbar('Script successfully executed!');
      },
      (err) => {
        this.props.openNotificationSnackbar('Execution failed!', 'error');
      });
  }
}