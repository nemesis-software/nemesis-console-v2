import React, {Component} from 'react';

import Dropdown from 'react-bootstrap/lib/Dropdown';

export default class AbstractInsertButton extends Component {
  constructor(props) {
    super(props);
    this.state = {isDropDownOpen: false};
  }

  render() {
    return (
      <Dropdown id="insert-link-button" disabled={this.props.disabled} open={this.state.isDropDownOpen} onToggle={this.onToggleDropdown.bind(this)}>
        <Dropdown.Toggle title={this.getButtonTitle()} noCaret onClick={this.openDropdown.bind(this)}>
          {this.getButtonIcon()}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.getDropDownContent()}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  insertContent() {
    let range = document.createRange();
    let selection = this.state.selection;
    range.setStart(selection.startNode, selection.startOffset);
    range.setEnd(selection.endNode, selection.endOffset);
    let html = this.getHTMLForInsert();
    let docSelection = document.getSelection();
    docSelection.removeAllRanges();
    docSelection.addRange(range);
    document.execCommand('insertHTML', false, html);
    this.setState({...this.state, isDropDownOpen: false})
  }

  onToggleDropdown(isOpen, ev, source) {
    if (source.source === 'rootClose') {
      this.setState({...this.state, isDropDownOpen: false})
    }
  }

  getHTMLForInsert() {
    return '<div>Abstract HTML</div>';
  }

  getDropDownContent() {
    return <div>From Abstract dropdown</div>
  }

  openDropdown() {
    let selection = document.getSelection();
    let copiedSelection = {
      startNode: selection.anchorNode,
      startOffset: selection.anchorOffset,
      endNode: selection.focusNode,
      endOffset: selection.focusOffset
    };
    this.setState({...this.state, isDropDownOpen: !this.state.isDropDownOpen, selection: copiedSelection})
  };

  getButtonIcon() {
    return false;
  }

  getButtonTitle() {
    return 'Insert Button';
  }
}