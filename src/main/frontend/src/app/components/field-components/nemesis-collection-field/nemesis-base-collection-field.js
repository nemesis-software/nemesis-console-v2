import React from 'react';
import NemesisBaseField from '../nemesis-base-field'

export default class NemesisBaseCollectionField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.getInputField()}
        {this.getItemsRender()}
      </div>
    )
  }

  getInputField() {
    return <div>Implement in parent</div>;
  }

  onDeleteRequest(itemIndex) {
    let items = this.state.value;
    items.splice(itemIndex, 1);
    this.onValueChange(null, items);
  }

  getItemRenderingValue(item) {
    return <span className="chip-item">{item}</span>;
  }

  getChipRenderer(item, index) {
    return (
      <div className="chip" key={index}>
        {this.getItemRenderingValue(item)}
        {!this.props.readOnly ? <i className="material-icons chip-item" onClick={() => this.onDeleteRequest(index)}>close</i> : false}
      </div>
    );

  }

  getItemsRender() {
    if (!this.state.value || this.state.value.length === 0) {
      return <div>No Records</div>
    } else {
      return (
        <div className="collection-container">
          {this.state.value.map((item, index) => this.getChipRenderer(item, index))}
        </div>
      )
    }
  }
}