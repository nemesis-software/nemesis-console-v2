import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';

export default class AdminImport extends Component {
  constructor(props) {
    super(props);

    this.state = {...this.state, file: '', value: ''};
    this.inputItem = null;
  }

  componentWillMount() {

  }

  render() {
    return (
      <div>
        <div>
          <button className="btn btn-default" onClick={() => this.inputItem.click()}>
            Upload
            <input ref={e => this.inputItem = e} onChange={this.handleFileChange.bind(this)} style={{display: 'none'}} type="file" />
          </button>
          <button className="btn btn-default" onClick={this.uploadFile.bind(this)}>Send as file</button>
          <button className="btn btn-default" onClick={this.uploadAsText.bind(this)}>Send as text</button>
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
      console.log(reader.result);
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
      () => {
        console.log('imported text');
      },
      (err) => {
        console.log(err);
      });
  }

  uploadFile() {
    if (!this.state.file) {
      return;
    }
    let data = new FormData();
    data.append('file', this.state.file);
    return PlatformApiCall.post('csv/file-import', data, 'multipart/form-data').then(
      () => {
        console.log('imported');
      },
      (err) => {
        console.log(err);
      });
  }

  //  platform/csv/file-import - upload as file

  // platform/csv/import - upload as text
}