import React, {Component} from 'react';

export default class AdminExpandable extends Component {
  constructor(props) {
    super(props);
    this.state = {isExpanded: true}
  }

  render() {
    return (
      <div className={'admin-expandable' + (this.state.isExpanded ? ' expanded' : '')}>
        <div className="expandable-header" onClick={() => this.setState({...this.state, isExpanded: !this.state.isExpanded})}>{this.getHeaderText()}</div>
        {this.state.isExpanded ? this.getExpandedContent() : false}
      </div>
    );
  }

  getExpandedContent() {
    return <div>Expanded in Base</div>
  }

  getHeaderText() {
    return this.props.name;
  }
}