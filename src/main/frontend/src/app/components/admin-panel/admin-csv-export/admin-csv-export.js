import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import CsvDtoBlock from './csv-dto-block';

const keyPrefix = 'dtoBlock';

export default class AdminCsvExport extends Component {
  constructor(props) {
    super(props);
    this.state = {csvBlocks: [keyPrefix + Date.now()]};
    this.blockReferences = [];
  }

  render() {
    return (
      <div className="admin-csv-export">
        <button className="nemesis-button success-button" style={{marginRight: '5px'}} onClick={this.onAddNewBlockButtonClick.bind(this)}>Add New Block</button>
        <button className="nemesis-button success-button" onClick={this.onExportCsvButtonClick.bind(this)}>Export Csv</button>
        {this.state.csvBlocks.map(item => <CsvDtoBlock ref={(el) => { el && this.blockReferences.push(el)}}
                                                       identityKey={item}
                                                       key={item}
                                                       removeBlock={this.removeBlock.bind(this)}/>)}
      </div>
    );
  }

  componentWillUpdate() {
    this.blockReferences = [];
  }

  onAddNewBlockButtonClick() {
    let csvBlocks = this.state.csvBlocks;
    csvBlocks.push(keyPrefix + Date.now());
    this.setState({csvBlocks: csvBlocks});
  }

  onExportCsvButtonClick() {
    if (!this.isBlocksValid()) {
      return;
    }
    let data = {blockDtos: []};
    this.blockReferences.forEach(block => {
      data.blockDtos.push(block.getBlockData());
    });
    PlatformApiCall.post('csv/export', data).then(result => {
      let csvContent = "data:text/csv;charset=utf-8," + result.data;
      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      let fileName = `exported_data_${new Date().getTime()}.csv`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  isBlocksValid() {
    let isNotValid = false;
    this.blockReferences.forEach(block => {
      let isBlockValid = block.isBlockValid();
      isNotValid = isNotValid || !isBlockValid;
    });
    return !isNotValid;
  }

  removeBlock(key) {
    let csvBlocks = this.state.csvBlocks;
    let indexOfBlock = csvBlocks.indexOf(key);
    if (indexOfBlock < 0) {
      return;
    }

    csvBlocks.splice(indexOfBlock, 1);
    this.setState({...this.state, csvBlocks: csvBlocks});
  }
}