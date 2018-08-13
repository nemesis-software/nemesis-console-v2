import React, {Component} from 'react';

export default class SelectEntityTableRenderer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <td className="select-entity-table-renderer">
        <input type="checkbox" className={"select-entity-checkbox nemesis-checkbox"  + (this.props.selectedIds[this.props.id] ? ' active' : '')} onChange={this.onChange.bind(this)}/>
      </td>
    )
  }

  onChange() {
    let result = {...this.props.selectedIds};
    if (result[this.props.id]) {
      delete result[this.props.id];
    } else {
      result[this.props.id] = true;
    }

    this.props.onSelectedIdsChange(result);
  }
}