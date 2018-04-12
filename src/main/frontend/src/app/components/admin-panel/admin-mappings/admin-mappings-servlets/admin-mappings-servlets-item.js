import React from 'react';

import AdminExpandable from '../../admin-expandable';


export default class AdminMappingsServletsItem extends AdminExpandable {
  constructor(props) {
    super(props);
  }

  getExpandedContent() {
    return (
      <div style={{padding: '10px'}}>
        <div style={{marginBotton: '10px'}}><b>Class name:</b> {this.props.servlet.className}</div>
        <div><b>Mappings:</b> {this.props.servlet.mappings.join(', ')}</div>
      </div>
    );
  }
}