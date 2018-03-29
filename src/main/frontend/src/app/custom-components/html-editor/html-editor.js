import React, {Component} from "react";

import Dropdown from "react-bootstrap/lib/Dropdown";
import MenuItem from "react-bootstrap/lib/MenuItem";

import Translate from "react-translate-component";

import InsertLinkButton from "./insert-link-button";
import InsertImageButton from "./insert-image-button";


const buttonGroupStyle = {
  marginRight: '5px',
  display: 'inline-block'
};

export default class HtmlEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {content : this.props.htmlContent || '', previewAsText: false};
    this.editableDiv = null;
  }

  render() {
    return (
      <div className="nemesis-html-editor">
        <div style={{marginBottom: '5px'}}>
          <div style={buttonGroupStyle}>
            <Dropdown id="html-headers" disabled={this.state.previewAsText}>
              <Dropdown.Toggle>
                <Translate content={'main.format'} fallback="Format"/>
              </Dropdown.Toggle>
              <Dropdown.Menu className="super-colors">
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'P')}>Paragraph</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H1')}>Heading 1</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H2')}>Heading 2</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H3')}>Heading 3</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H4')}>Heading 4</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H5')}>Heading 5</MenuItem>
                <MenuItem onClick={this.execCommand.bind(this, 'formatBlock', 'H6')}>Heading 6</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={buttonGroupStyle}>
            <button className="btn btn-default" title="Bold" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'bold')}><i className="fa fa-bold"/></button>
            <button className="btn btn-default" title="Italic" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'italic')}><i className="fa fa-italic"/></button>
            <button className="btn btn-default" title="Underline" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'underline')}><i className="fa fa-underline"/></button>
            <button className="btn btn-default" title="Strike Through" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'strikeThrough')}><i className="fa fa-strikethrough"/></button>
            <button className="btn btn-default" title="Quote" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'formatBlock', 'BLOCKQUOTE')}><i className="fa fa-quote-right"/></button>
          </div>
          <div style={buttonGroupStyle}>
            <button className="btn btn-default" title="Ordered List" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'insertOrderedList')}><i className="fa fa-list-ol"/></button>
            <button className="btn btn-default" title="Unordered List" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'insertUnorderedList')}><i className="fa fa-list-ul"/></button>
            <Dropdown id="html-align" disabled={this.state.previewAsText}>
              <Dropdown.Toggle>
                <Translate content={'main.align'} fallback="Align"/>
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
            <InsertLinkButton disabled={this.state.previewAsText}/>
            <InsertImageButton disabled={this.state.previewAsText}/>
          </div>
          <div style={buttonGroupStyle}>
            <button className="btn btn-default" title="Remove Format" disabled={this.state.previewAsText} onClick={this.execCommand.bind(this, 'removeFormat')}><i className="fa fa-eraser"/></button>
          </div>
          <div style={buttonGroupStyle}>
            <button className="btn btn-default" title={this.state.previewAsText? 'Text' : 'HTML'} onClick={() => this.setState({...this.state, previewAsText: !this.state.previewAsText})}><i className="fa fa-code"/></button>
          </div>
        </div>
        {this.state.previewAsText ? <textarea className="form-control"
                                              value={this.state.content}
                                              style={{width: '100%', height: '250px', overflow: 'auto', resize: 'none', borderRadius: '0'}}
                                              onChange={e => this.handleContentInput(e.target.value)} /> :
          <div className="form-control"
               style={{width: '100%', height: '250px', overflow: 'auto', padding: '10px 25px', borderRadius: '0'}}
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
      this.setState({...this.state, content: this.props.htmlContent});
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
