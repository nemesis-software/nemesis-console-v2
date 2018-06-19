import React, {Component} from 'react';
import Translate from 'react-translate-component';

export default class CollectionComparator extends Component {
  constructor(props) {
    super(props);
    this.state = {areEquals: this.isFieldsEqual(props)};
  }

  render() {
    return (
      <div className={'entity-field-comparator' + (this.state.areEquals ? ' equals' : ' not-equals')}>
        <div><Translate component="label" content={'main.' + this.props.field.fieldLabel} fallback={this.props.field.fieldLabel}/></div>
        <div className={'display-table'} style={{width: '100%'}}>
          {this.getItemRepresentation(this.props.firstData)}
          {this.getItemRepresentation(this.props.secondData)}
        </div>
        <hr/>
      </div>
    )
  }

  isFieldsEqual(props) {
    if (!props.firstData || !props.secondData) {
      return _.isEqual(props.firstData, props.secondData)
    }

    if (_.isObject(props.firstData[0])) {
      return _.isEqual(props.firstData.map(f => f.code), props.secondData.map(s => s.code));
    }

    return _.isEqual(props.firstData, props.secondData);
  }

  getItemRepresentation(item) {
    if (!item || item.length === 0) {
      return <div className="display-table-cell">No value</div>
    }

    return (
      <div className="display-table-cell">
        {_.isObject(item[0]) ? item.map((item, index) => <div key={index}>{item.code}</div>) : item.map((i, index) => <div key={index}>{i}</div>)}
      </div>
    );
  }


}
