import React, { Component } from 'react';

import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

const buttonGroupStyle = {
  marginRight: '3px',
  display: 'inline-block'
};

export default class LanguageChanger extends Component {
  constructor(props) {
    super(props);
    this.state = {content : this.props.htmlContent || '', previewAsText: false};
    this.editableDiv = null;
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: '5px'}}>
          <div style={buttonGroupStyle}>
            <Dropdown id="html-headers" disabled={this.state.previewAsText}>
              <Dropdown.Toggle>
                Headers
              </Dropdown.Toggle>
              <Dropdown.Menu className="super-colors">
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H1')}>Header 1</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H2')}>Header 2</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H3')}>Header 3</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H4')}>Header 4</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H5')}>Header 5</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H6')}>Header 6</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={buttonGroupStyle}>
            <button className="btn btn-default" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'bold')}><i className="fa fa-bold"/></button>
            <button className="btn btn-default" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'italic')}><i className="fa fa-italic"/></button>
            <button className="btn btn-default" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'underline')}><i className="fa fa-underline"/></button>
            <button className="btn btn-default" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'strikeThrough')}><i className="fa fa-strikethrough"/></button>
            <button className="btn btn-default" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'formatBlock', 'BLOCKQUOTE')}><i className="fa fa-quote-right"/></button>
          </div>
          <div style={buttonGroupStyle}>
            <button className="btn btn-default" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'insertOrderedList')}><i className="fa fa-list-ol"/></button>
            <button className="btn btn-default" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'insertUnorderedList')}><i className="fa fa-list-ul"/></button>
            <Dropdown id="html-align" disabled={this.state.previewAsText}>
              <Dropdown.Toggle>
                Align
              </Dropdown.Toggle>
              <Dropdown.Menu className="super-colors">
                <MenuItem onClick={this.execCommand.bind(this, 'justifyLeft')}>Left</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'justifyRight')}>Right</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'justifyCenter')}>Center</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'justifyFull')}>Justify</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={buttonGroupStyle}>
            <button className="btn btn-default" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'removeFormat')}><i className="fa fa-eraser"/></button>
          </div>
          <div style={buttonGroupStyle}>
            <button className="btn btn-default" onClick={() => this.setState({...this.state, previewAsText: !this.state.previewAsText})}><i className="fa fa-code"/></button>
          </div>
        </div>
        {this.state.previewAsText ? <textarea className="form-control"
                                              value={this.state.content}
                                              style={{width: '100%', height: '250px', overflow: 'auto', resize: 'none'}}
                                              onChange={e => this.handleContentInput(e.target.value)} /> :
          <div className="form-control"
               style={{width: '100%', height: '250px', overflow: 'auto'}}
               dangerouslySetInnerHTML={{__html : this.state.content}}
               ref={el => this.editableDiv = el}
               contentEditable={true}
               onKeyDown={this.handleContentEditableEnterClick.bind(this)}
               onInput={() => this.handleContentInput(this.editableDiv.innerHTML)} />}
      </div>
    );
  }

  handleContentEditableEnterClick(ev) {
    if (ev.keyCode === 13) {
      this.execCommand('insertHTML', '<br/><br/>');
      ev.preventDefault();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.previewAsText !== this.state.previewAsText) {
      return true;
    }

    return (
      !this.editableDiv || ( nextProps.htmlContent !== this.editableDiv.innerHTML && nextProps.htmlContent !== this.props.htmlContent )
    );
  }

  componentDidUpdate() {
    if ( this.editableDiv && this.props.htmlContent !== this.editableDiv.innerHTML ) {
      this.editableDiv.innerHTML = this.props.htmlContent;
    }
  }

  handleContentInput(value) {
    this.setState({...this.state, content: value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  execCommand(command, arg) {
    document.execCommand(command, false, arg);
  }
}