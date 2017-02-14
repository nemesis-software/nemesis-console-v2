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
        {this.getItemsRender()}
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

  getChipRenderer(item, index) {
    let config = {
      key: index,
      children: this.getItemRenderingValue(item)
    };

    if (!this.props.readOnly) {
      config.onRequestDelete = () => this.onDeleteRequest(index);
    }

    return React.createElement(Chip, config)
  }

  getItemsRender() {
    if (!this.state.value || this.state.value.length === 0) {
      return <div>No Records</div>
    } else {
      return (
        <div>
          {this.state.value.map((item, index) => this.getChipRenderer(item, index))}
        </div>
      )
    }
  }
}