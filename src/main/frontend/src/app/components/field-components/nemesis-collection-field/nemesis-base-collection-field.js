import React, { Component } from 'react';
import NemesisBaseField from '../nemesis-base-field'
import Chip from 'material-ui/Chip';

export default class NemesisBaseCollectionField extends NemesisBaseField {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          {this.state.value.map((item, index) => {
            return <Chip key={index} onRequestDelete={() => this.onDeleteRequest(index)}>{this.getItemRenderingValue(item)}</Chip>
          })}
        </div>
        {this.getInputField()}
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
    return item;
  }
}