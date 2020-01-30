import React, {Component} from 'react';

import {Link} from 'react-router-dom';

import _ from 'lodash';

export default class NemesisSideBar extends Component {
  constructor(props) {
    super(props);
    this.isAdmin = document.getElementById('authorities').getAttribute('value').indexOf('ROLE_ADMINGROUP') > -1;
  }

  render() {
    const pathName = this.props.routerProps.location.pathname;
    return (
      <div className="nemesis-side-bar">
      {/*
       <Link to="/theme">
         <div title="Theme" className={"nemesis-side-bar-item" + (pathName.startsWith("/theme") ? " selected" : "")}><i className="fas fa-palette
          nemesis-side-bar-icon"></i></div>
        </Link>
        */}
        <Link to="/pos">
          <div title="Point of sale" className={"nemesis-side-bar-item" + (pathName.startsWith("/pos") ? " selected" : "")}><i className="fa fa-shopping-basket nemesis-side-bar-icon"></i></div>
        </Link>
        {_.map(_.keys(this.props.sidebarData), item => {
          return (
            <Link to={`/${item}`} key={item}>
            <div title={item} className={"nemesis-side-bar-item"+ (pathName.startsWith(`/${item}`) ? " selected" : "")}><i className={"nemesis-side-bar-icon fa " + this.getIcon(item)}></i></div>
          </Link>
          )
        })}
        {/*
        {this.isAdmin ?
          <Link to="/customer">
            <div title="Customer" className={"nemesis-side-bar-item" + (pathName.startsWith("/customer") ? " selected" : "")}><i className="fas fa-user nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
          */}
        <Link to="/">
          <div title="Admin" className={"nemesis-side-bar-item" + (pathName === "/" ? " selected" : "")}><i className="fa fa-chart-bar nemesis-side-bar-icon"></i></div>
        </Link>
        {/*
        {this.isAdmin ?
          <Link to="/kie">
            <div title="KIE" className={"nemesis-side-bar-item" + (pathName.startsWith("/kie") ? " selected" : "")}><i className="far fa-lightbulb
            nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
        {this.isAdmin ?
          <Link to="/bpmn">
            <div title="BPMN" className={"nemesis-side-bar-item" + (pathName.startsWith("/bpmn") ? " selected" : "")}><i className="fas fa-chalkboard-teacher
            nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
        {this.isAdmin ?
          <Link to="/dmn">
            <div title="DMN" className={"nemesis-side-bar-item" + (pathName.startsWith("/dmn") ? " selected" : "")}><i className="fas fa-table
            nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
        {this.isAdmin ?
          <Link to="/brm">
            <div title="rules" className={"nemesis-side-bar-item" + (pathName.startsWith("/brm") ? " selected" : "")}><i className="fas fa-ruler
            nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
        {this.isAdmin ?
          <Link to="/taxonomy">
            <div title="Taxonomy" className={"nemesis-side-bar-item" + (pathName.startsWith("/taxonomy") ? " selected" : "")}><i className="fa  fa-project-diagram nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
          */}
        {this.isAdmin ?
          <Link to="/maintenance">
            <div title="Maintenance" className={"nemesis-side-bar-item" + (pathName.startsWith("/maintenance") ? " selected" : "")}><i className="fa fa-file-code nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
        {this.isAdmin ?
          <Link to="/console-configuration">
            <div title="Console configuration" className={"nemesis-side-bar-item"+ (pathName.startsWith("/console-configuration") ? " selected" : "")}><i className="fa fa-cog nemesis-side-bar-icon"></i></div>
          </Link>
          : false}
      </div>
    );
  }

  getIcon(item) {
    switch (item) {
      case 'content': return 'fa-columns';
      case 'product': return 'fa-box';
      case 'shop': return 'fa-shopping-basket';
      case 'customer': return 'fa-users';
      default: return 'fa-folder'
    }
  }
}
