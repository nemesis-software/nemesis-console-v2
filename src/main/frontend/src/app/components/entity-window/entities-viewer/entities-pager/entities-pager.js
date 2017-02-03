import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={{display: 'inline-block'}}>
          <div style={styles.table}>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onFirstPageButtonClick.bind(this)}>first_page</i>
            </div>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onPrevPageButtonClick.bind(this)}>chevron_left</i>
            </div>
            <div style={{...styles.tableCell, fontSize: '24px'}}>
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
        <SelectField
          style={{width: '100px', marginLeft: '15px'}}
          value={this.props.page.size}
          floatingLabelText="Page size"
          onChange={this.handlePageSizeChange.bind(this)}>
          {pageSizes.map((size, index) => <MenuItem key={index} value={size} primaryText={size} />)}
        </SelectField>
      </div>
    )
  }

  handlePageSizeChange(event, index, value) {
    this.props.onPagerChange(1, pageSizes[index]);
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