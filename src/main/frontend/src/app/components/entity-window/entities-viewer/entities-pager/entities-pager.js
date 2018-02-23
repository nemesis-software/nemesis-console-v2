import React, { Component } from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';

import SelectCustomArrow from '../../../helper-components/select-custom-arrow';

const styles = {
  table: {
    display: 'table'
  },
  tableRow: {
    display: 'table-row'
  },
  tableCell: {
    display: 'table-cell',
    verticalAlign: 'middle'
  },
  navButton: {
    cursor: 'pointer',
    fontSize: '30px'
  },
  container: {
    display: 'inline-block',
    userSelect: 'none',
    margin: '0 10px'
  },
};

const pageSizes = [20, 50, 100, 1000];

export default class EntitiesPager extends Component {
  constructor(props) {
    super(props);
    this.state = {pageSize: pageSizes[0]};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page && this.state.pageSize !== nextProps.page.size) {
      this.setState({pageSize: nextProps.page.size});
    }
  }

  render() {
    return (
      <div className="entities-pager-container">
        <div className="entities-pager">
          <div className="display-table">
            <div className="display-table-cell entities-pager-button-container">
              <i className="material-icons entities-pager-button" onClick={this.onFirstPageButtonClick.bind(this)}>first_page</i>
            </div>
            <div className="display-table-cell entities-pager-button-container">
              <i className="material-icons entities-pager-button" onClick={this.onPrevPageButtonClick.bind(this)}>chevron_left</i>
            </div>
            <div className="display-table-cell page-content">
              {this.props.page.number + 1} of {Math.max(this.props.page.totalPages, 1)}
            </div>
            <div className="display-table-cell entities-pager-button-container">
              <i className="material-icons entities-pager-button" onClick={this.onNextPageButtonClick.bind(this)}>chevron_right</i>
            </div>
            <div className="display-table-cell entities-pager-button-container">
              <i className="material-icons entities-pager-button" onClick={this.onLastPageButtonClick.bind(this)}>last_page</i>
            </div>
          </div>
        </div>
        <div style={{display: 'inline-block', width: '80px'}}>
          <label><Translate content={'main.pageSize'} fallback={'Page Size'} /></label>
          <Select clearable={false}
                  arrowRenderer={() => <SelectCustomArrow/>}
                  disabled={this.props.readOnly}
                  value={{value: this.state.pageSize, label: this.state.pageSize}}
                  onChange={(item) => this.handlePageSizeChange(item)}
                  options={pageSizes.map(size => {
                    return {value: size, label: size}
                  })}/>
        </div>
      </div>
    )
  }

  handlePageSizeChange(item) {
    this.setState({pageSize: item.value});
    this.props.onPagerChange(0, item.value);
  }

  onFirstPageButtonClick() {
    if (this.props.page.number === 0) {
      return;
    }

    this.props.onPagerChange(0, this.state.pageSize);
  }

  onPrevPageButtonClick() {
    if (this.props.page.number === 0) {
      return;
    }

    this.props.onPagerChange(this.props.page.number - 1, this.state.pageSize);
  }

  onNextPageButtonClick() {
    if (this.props.page.number >= this.props.page.totalPages - 1) {
      return;
    }

    this.props.onPagerChange(this.props.page.number + 1, this.state.pageSize);
  }

  onLastPageButtonClick() {
    if (this.props.page.number >= this.props.page.totalPages - 1) {
      return;
    }

    this.props.onPagerChange(this.props.page.totalPages - 1, this.state.pageSize);
  }
}