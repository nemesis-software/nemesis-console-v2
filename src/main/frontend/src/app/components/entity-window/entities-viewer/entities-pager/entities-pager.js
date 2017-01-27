import React, { Component } from 'react';

const styles = {
  navButton: {
    cursor: 'pointer',
    fontSize: '30px'
  },
  container: {
    display: 'inline-block',
    userSelect: 'none'
  },
  content: {
    fontSize: '24px',
    verticalAlign: 'top',
    padding: '0 10px'
  }
};

export default class EntitiesPager extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.container}>
        <i style={styles.navButton} className="material-icons" onClick={this.onFirstPageButtonClick.bind(this)}>first_page</i>
        <i style={styles.navButton} className="material-icons" onClick={this.onPrevPageButtonClick.bind(this)}>chevron_left</i>
        <span style={styles.content}>{this.props.page.number + 1} of {Math.max(this.props.page.totalPages, 1)}</span>
        <i style={styles.navButton} className="material-icons" onClick={this.onNextPageButtonClick.bind(this)}>chevron_right</i>
        <i style={styles.navButton} className="material-icons" onClick={this.onLastPageButtonClick.bind(this)}>last_page</i>
      </div>
    )
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