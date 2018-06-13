import React, {Component} from 'react';


export default class SimpleComparator extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {areEquals: this.isFieldsEqual(props)};

  }

  render() {
    return (
      <div className="display-table" style={{width: '100%'}}>
        <div className="display-table-cell">{this.getItemRepresentation(this.props.firstData)}</div>
        <div className="display-table-cell">{this.getItemRepresentation(this.props.secondData)}</div>
      </div>
    )
  }

  isFieldsEqual(props) {
    return props.firstData === props.secondData;
  }

  getItemRepresentation(item) {
    if (!item) {
      return 'No value';
    }

    if (typeof item === 'string') {
      return item;
    }

    return JSON.stringify(item);
  }
}
