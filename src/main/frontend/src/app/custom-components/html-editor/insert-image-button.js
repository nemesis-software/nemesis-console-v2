import React from 'react';
import AbstractInsertButton from './abstract-insert-button';


export default class InsertLinkButton extends AbstractInsertButton {
  constructor(props) {
    super(props);
    this.state = {link: '', width: '', height: '', isDropDownOpen: false};
  }

  getDropDownContent() {
    return (
      <div style={{width: '200px', padding: '5px 10px'}}>
        <label>Link</label>
        <input className="form-control" value={this.state.link} onChange={e => this.setState({...this.state, link: e.target.value})} placeholder="Link"/>
        <label>Width (optional)</label>
        <input className="form-control" value={this.state.width} onChange={e => this.setState({...this.state, width: e.target.value})} placeholder="Width"/>
        <label>Height (optional)</label>
        <input className="form-control" value={this.state.height} onChange={e => this.setState({...this.state, height: e.target.value})} placeholder="Height"/>
        <div style={{textAlign: 'center'}}>
          <button style={{margin: '5px 0'}} className="btn btn-default" onClick={this.insertContent.bind(this)}>Add Image</button>
        </div>
      </div>
    );
  }

  getHTMLForInsert() {
    return `<img src="${this.state.link}" width="${this.state.width}" height="${this.state.height}"/>`;
  }

  getButtonIcon() {
    return <i className="fa fa-picture-o"/>;
  }


  getButtonTitle() {
    return 'Insert Image';
  }
}