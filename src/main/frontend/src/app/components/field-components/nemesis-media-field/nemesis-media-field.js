import React from 'react';
import NemesisBaseField from '../nemesis-base-field'

export default class NemesisTextField extends NemesisBaseField {
  constructor(props) {
    super(props);
    this.state = {...this.state, file: ''};
    this.inputItem = null;
  }

  render() {
    return (
      <div>
        <button className="btn btn-default" onClick={() => this.inputItem.click()}>
          Upload
          <input ref={e => this.inputItem = e} onChange={this.handleImageChange.bind(this)} style={{display: 'none'}} type="file" />
        </button>
        <div>
          <img src={this.state.value} alt="No image" height="200" width="300"/>
        </div>
      </div>
    )
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        ...this.state,
        isDirty: true,
        file: file,
        value: reader.result
      });
    };

    reader.readAsDataURL(file);
  }

  getChangeValue() {
    if (this.state.isDirty) {
      return {name: this.props.name, value: this.state.file, isMedia: true};
    }

    return null;
  }
}