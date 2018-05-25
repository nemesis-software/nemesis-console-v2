import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';

export default class AdminImport extends Component {
  constructor(props) {
    super(props);

    this.state = {...this.state, file: '', value: ''};
    this.inputItem = null;
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: '10px'}}>
          <button className="nemesis-button success-button" style={{marginRight: '5px'}} onClick={() => this.inputItem.click()}>
            Upload
            <input ref={e => this.inputItem = e} onChange={this.handleFileChange.bind(this)} style={{display: 'none'}} type="file" />
          </button>
          <button className="nemesis-button success-button" style={{marginRight: '5px'}} onClick={this.uploadFile.bind(this)}>Send as file</button>
          <button className="nemesis-button success-button" onClick={this.uploadAsText.bind(this)}>Send as text</button>
        </div>
        <textarea style={{width: '100%', resize: 'vertical'}} name="csv-content" onChange={e => this.setState({...this.state, value: e.target.value})} cols="30" rows="30" value={this.state.value} />
      </div>
    );
  }

  handleFileChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        ...this.state,
        file: file,
        value: reader.result
      });
    };
    reader.readAsText(file);
  }

  uploadAsText() {
    if (!this.state.value) {
      return;
    }

    return PlatformApiCall.post('csv/import', {csv: this.state.value}).then(
      this.onImportSuccess.bind(this),
      this.onImportFail.bind(this)
    );
  }

  uploadFile() {
    if (!this.state.file) {
      return;
    }
    let data = new FormData();
    data.append('file', this.state.file);
    return PlatformApiCall.post('csv/file-import', data, 'multipart/form-data').then(
        this.onImportSuccess.bind(this),
        this.onImportFail.bind(this)
    );
  }

  onImportSuccess() {
    this.props.openNotificationSnackbar('CSV successfully imported');
  }

  onImportFail(err) {
    this.props.openNotificationSnackbar('Execution failed!', 'error');
  }
}