import React, { Component } from 'react';

import Translate from 'react-translate-component';

import Select from 'react-select';

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

  render() {
    return (
      <div style={styles.container}>
        <div style={{display: 'inline-block', verticalAlign: 'bottom', marginRight: '10px'}}>
          <div style={styles.table}>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onFirstPageButtonClick.bind(this)}>first_page</i>
            </div>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onPrevPageButtonClick.bind(this)}>chevron_left</i>
            </div>
            <div style={{...styles.tableCell, fontSize: '20px', fontWeight: 'normal', paddingBottom: '5px'}}>
              {this.props.page.number + 1} of {Math.max(this.props.page.totalPages, 1)}
            </div>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onNextPageButtonClick.bind(this)}>chevron_right</i>
            </div>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onLastPageButtonClick.bind(this)}>last_page</i>
            </div>
          </div>
        </div>
        <div style={{display: 'inline-block'}}>
          <label><Translate content={'main.pageSize'} fallback={'Page Size'} /></label>
          <Select style={{width: '100%'}}
                  clearable={false}
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
    this.props.onPagerChange(1, item.value);
  }

  onFirstPageButtonClick() {
    if (this.props.page.number === 0) {
      return;
    }

    this.props.onPagerChange(1, 20);
  }

  onPrevPageButtonClick() {
    if (this.props.page.number === 0) {
      return;
    }

    this.props.onPagerChange(this.props.page.number, 20);
  }

  onNextPageButtonClick() {
    if (this.props.page.number + 1 >= this.props.page.totalPages) {
      return;
    }

    this.props.onPagerChange(this.props.page.number + 2, 20);
  }

  onLastPageButtonClick() {
    if (this.props.page.number + 1 >= this.props.page.totalPages) {
      return;
    }

    this.props.onPagerChange(this.props.page.totalPages, 20);
  }
}