import React, {Component} from 'react';
import Translate from 'react-translate-component';
import {nemesisFieldTypes} from "../../../types/nemesis-types";


export default class LocalizedComparator extends Component {
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
    return _.isEqual(props.firstData,props.secondData);
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
