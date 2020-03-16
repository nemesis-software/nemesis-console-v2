import React, {Component} from 'react';
import PlatformApiCall from 'servicesDir/platform-api-call';
import SwipeableViews from 'react-swipeable-views';

import _ from 'lodash';
import AdminMappingsServlets from "./admin-mappings-servlets/admin-mappings-servlets";
import AdminMappingsServletFilters from "./admin-mappings-servlet-filters/admin-mappings-servlet-filters";
import AdminMappingsDispatcherServlets from "./admin-mappings-dispatcher-servlets/admin-mappings-dispatcher-servlets";

export default class AdminMappings extends Component {
  constructor(props) {
    super(props);
    this.state = {dispatcherServlet: [], servletFilters: [], servlets: [], sectionIndex: 0};
  }

  componentDidMount() {
    this.getMappingsData();
  }

  render() {
    return (
      <div className="admin-mappings">
        <div className="navigation-bar">
          <div className={'navigation-bar-item' + (this.state.sectionIndex === 0 ? ' active' : '')} onClick={() => this.handleChange(0)}>Dispatcher Servlets</div>
          <div className={'navigation-bar-item' + (this.state.sectionIndex === 1 ? ' active' : '')} onClick={() => this.handleChange(1)}>Servlet Filters</div>
          <div className={'navigation-bar-item' + (this.state.sectionIndex === 2 ? ' active' : '')} onClick={() => this.handleChange(2)}>Servlets</div>
        </div>
        <SwipeableViews
          index={this.state.sectionIndex}
          onChangeIndex={this.handleChange}
        >
          <AdminMappingsDispatcherServlets data={this.state.dispatcherServlet}/>
          <AdminMappingsServletFilters data={this.state.servletFilters}/>
          <AdminMappingsServlets data={this.state.servlets}/>
        </SwipeableViews>
      </div>
    );
  }

  getMappings(data) {
    if (data.mappings) {
      return data.mappings;
    }

    let mappings = null;
    _.forIn(data, (value, key) => {
      if (!mappings) {
        mappings = this.getMappings(value);
      }
    });

    return mappings;
  }

  getMappingsData() {
    PlatformApiCall.get('mappings').then(result => {
      let mappings = this.getMappings(result.data);
      this.setState({dispatcherServlet: mappings.dispatcherServlets.dispatcherServlet, servletFilters: mappings.servletFilters, servlets: mappings.servlets})
    });
  }

  handleChange = (value) => {
    this.setState({sectionIndex: value});
  };
}