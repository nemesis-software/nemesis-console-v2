import React, {Component} from 'react';
import Translate from 'react-translate-component';


export default class SimpleComparator extends Component {
  constructor(props) {
    super(props);
    this.state = {areEquals: this.isFieldsEqual(props)};
  }

  render() {
    return (
      <div className={'entity-field-comparator' + (this.state.areEquals ? ' equals' : ' not-equals')}>
        <div><Translate component="label" content={'main.' + this.props.field.fieldLabel} fallback={this.props.field.fieldLabel}/></div>
        <div className={'display-table'} style={{width: '100%'}}>
          <div className="display-table-cell">{this.getItemRepresentation(this.props.firstData)}</div>
          <div className="display-table-cell">{this.getItemRepresentation(this.props.secondData)}</div>
        </div>
        <hr/>
      </div>
    )
  }

  isFieldsEqual(props) {
    return _.isEqual(props.firstData, props.secondData);
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
