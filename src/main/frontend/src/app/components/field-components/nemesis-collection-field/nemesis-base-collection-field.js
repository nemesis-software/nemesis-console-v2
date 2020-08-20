import React from 'react';
import NemesisBaseField from '../nemesis-base-field';
import ConsolePopup from "../../../custom-components/backend-console-popup";

export default class NemesisBaseCollectionField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = {
      showValueConsolePopUp: false,
      selectedItemId: null
    };
  };

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
  };

  onDeleteRequest(itemIndex) {
    let items = this.state.value;
    items.splice(itemIndex, 1);
    this.onValueChange(null, items);
  };

  getItemRenderingValue = (item) => {
    return <span className="chip-item">{item}</span>;
  };

  onEditClick = (item, index) => {
    this.setState({ showValueConsolePopUp: true, selectedItemId: item, index: index });
  };



  getChipRenderer = (item, index) => {
    return (
      <div className="chip" key={index}>
        {!this.props.attributes && <i className="fa fa-chevron-left reorder-icon reorder-back-icon" onClick={() => this.onChipReorderBack(index)} />}
        {this.getItemRenderingValue(item)}
        {this.props.attributes && <i className="material-icons" onClick={() => this.onEditClick(this.props.attribitesIds[index], index)}>
          edit  </i>}
        {!this.props.readOnly ? <i className="material-icons chip-item" onClick={() => this.props.onAttributeDelete(this.props.currentUnitId, item, this.props.attribitesIds[index])}>close</i> : false}
        {!this.props.attributes && <i className="fa fa-chevron-right reorder-icon reorder-front-icon" onClick={() => this.onChipReorderFront(index)} />}
        {(this.state.showValueConsolePopUp && this.state.selectedItemId && this.state.index === index) && (
          <ConsolePopup
            open={this.state.showValueConsolePopUp}
            itemId={this.state.selectedItemId && this.state.selectedItemId}
            entityId="taxonomy_value"
            entityName="taxonomy_value"
            onClose={() =>
              this.setState({ showValueConsolePopUp: false, selectedItemId: null })
            }
          />
        )}
      </div>
    );
  }

  getItemsRender() {
    if (!this.state.value || this.state.value.length === 0) {
      return <div className="empty-collection-label">No Records</div>
    } else {
      return (
        <div className="collection-container">
          {this.state.value.map((item, index) => this.getChipRenderer(item, index))}
        </div>
      )
    }
  };

  onChipReorderBack(itemIndex) {
    if (itemIndex === 0) {
      return;
    }
    let items = this.state.value;
    let previusItem = items[itemIndex - 1];
    items[itemIndex - 1] = items[itemIndex];
    items[itemIndex] = previusItem;
    this.onValueChange(null, items);
  };

  onChipReorderFront(itemIndex) {
    if (itemIndex === this.state.value.length - 1) {
      return;
    }

    let items = this.state.value;
    let nextItem = items[itemIndex + 1];
    items[itemIndex + 1] = items[itemIndex];
    items[itemIndex] = nextItem;
    this.onValueChange(null, items);
  };
}