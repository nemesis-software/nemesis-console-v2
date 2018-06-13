import React, {Component} from 'react';


export default class CollectionComparator extends Component {
  constructor(props) {
    super(props);
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
    if (!props.firstData || !props.secondData) {
      return _.isEqual(props.firstData, props.secondData)
    }

    if (_.isObject(props.firstData[0])) {
      return _.isEqual(props.firstData.map(f => f.id), props.secondData.map(s => s.id));
    }

    return _.isEqual(props.firstData, props.secondData);
  }

  getItemRepresentation(item) {
    if (!item || item.length === 0) {
      return <div className="display-table-cell">No value</div>
    }

    return (
      <div className="display-table-cell">
        {_.isObject(item[0]), }
      </div>
    );
  }


}
