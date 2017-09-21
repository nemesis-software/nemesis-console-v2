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
        <button className="btn btn-default" style={{marginRight: '5px'}} onClick={this.onAddNewBlockButtonClick.bind(this)}>Add New Block</button>
        <button className="btn btn-default" onClick={this.onExportCsvButtonClick.bind(this)}>Export Csv</button>
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
    PlatformApiCall.post('csv/export', data);
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