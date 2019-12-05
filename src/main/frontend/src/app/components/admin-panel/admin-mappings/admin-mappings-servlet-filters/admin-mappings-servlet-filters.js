import React, {Component} from 'react';
import counterpart from "counterpart";
import AdminMappingsServletFiltersItem from "./admin-mappings-servlet-filter-item";


export default class AdminMappingsServletFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {servletFilters: props.data || []}

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data)) {
      this.setState({servletFilters: nextProps.data});
    }
  }

  render() {
    return (
      <div className="admin-mappings-servlet-filters">
        <div className="input-group">
          <input type="text"
                 placeholder={counterpart.translate('main.filterServletMappings', {fallback: 'Filter servlet mappings'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search"/></span>
        </div>
        {this.state.servletFilters.map(filter => <AdminMappingsServletFiltersItem key={filter.name} filter={filter} name={filter.name}/>)}
      </div>
    );
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let servletFilters = this.props.data;
    if (searchValue) {
      servletFilters = servletFilters.filter(filter => {
        let hasMapping = false;
        filter.urlPatternMappings.forEach(mapping => {
          if (mapping.indexOf(searchValue) > -1) {
            hasMapping = true;
          }
        });
        return hasMapping;
      })
    }

    this.setState({servletFilters: servletFilters});
  }
}