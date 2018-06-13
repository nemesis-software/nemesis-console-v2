import React, {Component} from 'react';


export default class EntityComparator extends Component {
  constructor(props) {
    super(props);
    this.state = {areEquals: this.isFieldsEqual(props)};
  }

  render() {
    return (
      <div className="display-table" style={{width: '100%'}}>
        <div className="display-table-cell">{this.getItemText(this.props.firstData)}</div>
        <div className="display-table-cell">{this.getItemText(this.props.secondData)}</div>
      </div>
    )
  }

  isFieldsEqual(props) {
    if (!props.firstData || !props.secondData) {
      return _.isEqual(props.firstData, props.secondData)
    }

    return props.firstData.id === props.secondData.id;
  }

  getItemText(item) {
    if (!item) {
      return 'No value';
    }
    let text = item.code;
    if (this.props.entityId === 'catalog_version') {
      text = item.catalogVersion || item.code;
    } else if (this.props.entityId === 'cms_slot') {
      text = `${item.code} - ${item.position}`
    } else if (item.catalogVersion) {
      text = `${item.code} - ${item.catalogVersion}`
    }

    return text;
  }
}
