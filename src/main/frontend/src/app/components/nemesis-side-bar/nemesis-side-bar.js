import React, {Component} from 'react';

import {Link} from 'react-router-dom';

export default class NemesisSideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="nemesis-side-bar">
        <Link to="/pos">
          <div title="Point of sale" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">add_to_queue</i></div>
        </Link>
        <Link to="/content">
          <div title="Content" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">web</i></div>
        </Link>
        <Link to="/shop">
          <div title="Shop" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">shopping_cart</i></div>
        </Link>
        <Link to="/product">
          <div title="Product" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">toys</i></div>
        </Link>
        <Link to="/customer">
          <div title="Customer" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">person</i></div>
        </Link>
        <Link to="/maintenance">
          <div title="Maintenance" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">settings_remote</i></div>
        </Link>
        <Link to="/">
          <div title="Admin" className="nemesis-side-bar-item"><i className="material-icons nemesis-side-bar-icon">settings</i></div>
        </Link>
      </div>
    );
  }

}