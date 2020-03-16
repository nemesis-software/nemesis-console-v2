import React, {Component} from 'react';
import AdminMappingsServletsItem from "./admin-mappings-servlets-item";
import _ from 'lodash';
import counterpart from "counterpart";

export default class AdminMappingsServlets extends Component {
  constructor(props) {
    super(props);
    this.state = {servlets: props.data || []}
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data)) {
      this.setState({servlets: nextProps.data});
    }
  }

  render() {
    return (
      <div className="admin-mappings-servlets">
        <div className="input-group">
          <input type="text"
                 placeholder={counterpart.translate('main.filterServletMappings', {fallback: 'Filter servlet mappings'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search"/></span>
        </div>
        {this.state.servlets.map(servlet => <AdminMappingsServletsItem key={servlet.name} servlet={servlet} name={servlet.name}/>)}
      </div>
    );
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let servlets = this.props.data;
    if (searchValue) {
      servlets = servlets.filter(servlet => {
        let hasMapping = false;
        servlet.mappings.forEach(mapping => {
          if (mapping.indexOf(searchValue) > -1) {
            hasMapping = true;
          }
        });
        return hasMapping;
      })
    }

    this.setState({servlets: servlets});
  }
}