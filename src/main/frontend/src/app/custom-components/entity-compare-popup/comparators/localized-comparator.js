import React, {Component} from 'react';


export default class LocalizedComparator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="display-table" style={{width: '100%'}}>
        {this.getItemRepresentation(this.props.firstData)}
        {this.getItemRepresentation(this.props.secondData)}
      </div>
    )
  }

  getItemRepresentation(item) {
    if (!item) {
      return <div className="display-table-cell">No value</div>
    }

    return (
      <div className="display-table-cell">
        <div><label>EN:</label> {item.en && item.en.value || ''}</div>
        <div><label>BG:</label> {item.bg_BG && item.bg_BG.value || ''}</div>
      </div>
    );
  }
}
