import React from 'react';

import AdminExpandable from '../../admin-expandable';


export default class AdminMappingsServletFiltersItem extends AdminExpandable {
  constructor(props) {
    super(props);
  }

  getExpandedContent() {
    return (
      <div style={{padding: '10px'}}>
        <div style={{marginBotton: '10px'}}><b>Class name:</b> {this.props.filter.className}</div>
        <div style={{marginBotton: '10px'}}><b>Url Pattern Mappings:</b> {this.props.filter.urlPatternMappings.join(', ')}</div>
        <div><b>Servlet Name Mappings:</b> {this.props.filter.servletNameMappings.join(', ')}</div>
      </div>
    );
  }
}