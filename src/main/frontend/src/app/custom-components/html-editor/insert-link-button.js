import React from 'react';
import AbstractInsertButton from './abstract-insert-button';


export default class InsertLinkButton extends AbstractInsertButton {
  constructor(props) {
    super(props);
    this.state = {link: '', text: '', isDropDownOpen: false};
  }

  getDropDownContent() {
    return (
      <div style={{width: '200px', padding: '5px 10px'}}>
        <label>Link</label>
        <input className="form-control" value={this.state.link} onChange={e => this.setState({...this.state, link: e.target.value})} placeholder="Link"/>
        <label>Text</label>
        <input className="form-control" value={this.state.text} onChange={e => this.setState({...this.state, text: e.target.value})} placeholder="Text"/>
        <div style={{textAlign: 'center'}}>
          <button style={{margin: '5px 0'}} className="btn btn-default" onClick={this.insertContent.bind(this)}>Add link</button>
        </div>
      </div>
    );
  }

  getHTMLForInsert() {
    return `<a href="${this.state.link}">${this.state.text}</a>`;
  }

  getButtonIcon() {
    return <i className="fa fa-link"/>;
  }

  getButtonTitle() {
    return 'Insert Link';
  }
}