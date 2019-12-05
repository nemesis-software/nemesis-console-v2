import React, {Component} from 'react';
import PlatformApiCall from '../../../services/platform-api-call';
import Modal from 'react-bootstrap/lib/Modal';
import _ from 'lodash';
import counterpart from 'counterpart';

import EntitiesPager from '../../entity-window/entities-viewer/entities-pager/entities-pager';

export default class AdminDatabase extends Component {
  constructor(props) {
    super(props);
    this.state = {openDialog: '', pendingMigrations: [], migrations: [], filteredMigrations: [], page: {}};
  }

  componentDidMount() {
    PlatformApiCall.get('flyway').then(result => {
        let flywayObj = this.findFlyway(result.data);
        let otherMigrations = flywayObj.migrations.filter(migration => migration.state.toLowerCase() !== 'pending').sort((a,b) => (a.installedRank > b.installedRank) ? -1 : ((b.installedRank > a.installedRank) ? 1 : 0));
        let pendingMigrations = flywayObj.migrations.filter(migration => migration.state.toLowerCase() === 'pending');
        this.setState({
          migrations: otherMigrations,
          pendingMigrations: pendingMigrations,
          filteredMigrations: otherMigrations,
          page: this.buildPageObject(otherMigrations.length, 20, 0)
        });
    });
  }

  findFlyway(data) {
      if (data.flyway) {
        return data.flyway;
      }

      let migrations = null;
      _.forIn(data, (value, key) => {
        if (!migrations) {
          migrations = this.findFlyway(value);
        }
      });

      return migrations;
  }

  render() {
    return (
      <div className="paper-box">
          <div className="admin-database-actions" style={{marginBottom: '2%'}}>
            <h1>Actions</h1>
            <button className="nemesis-button dark-button" style={{marginRight: '5%'}} onClick={this.onActionButtonClick.bind(this, "update")}>Update</button>
            <button className="nemesis-button success-button" style={{marginRight: '5%'}} onClick={this.onActionButtonClick.bind(this, "repair")}>Repair</button>
            <button className="nemesis-button danger-button" onClick={this.onActionButtonClick.bind(this, "init")}>Initialize</button>
          </div>
          <EntitiesPager onPagerChange={this.onPagerChange.bind(this)}  page={this.state.page} />
          <div className="input-group" style={{margin: '10px 0'}}>
              <input type="text"
                 placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
              <span className="input-group-addon"><i className="fa fa-search" /></span>
          </div>
          <div className="admin-database">
              <div style={{textAlign: 'center'}}>
                  <h1>Migrations</h1>
              </div>
              <div>
                  <table style={{width: '100%', tableLayout: 'fixed'}} className="table table-striped">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Type</th>
                          <th>Version</th>
                          <th>Description</th>
                          <th>Script</th>
                          <th>State</th>
                        </tr>
                      </thead>
                      <tbody>
                      {
                        this.state.pendingMigrations.map((item, index) => {
                          return (
                            <tr key={index} style={{backgroundColor:'yellow'}}>
                              <td style={{wordWrap: 'break-word'}}>{item.installedRank}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.type}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.version}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.description}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.script}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.state}</td>
                            </tr>
                          )
                        })
                      }
                      {
                        this.getMigrationsForPage().map((item, index) => {
                          return (
                            <tr key={index} style={{backgroundColor:'palegreen'}}>
                              <td style={{wordWrap: 'break-word'}}>{item.installedRank}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.type}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.version}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.description}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.script}</td>
                              <td style={{wordWrap: 'break-word'}}>{item.state}</td>
                            </tr>
                          )
                        })
                      }
                      </tbody>
                  </table>
              </div>
          </div>
          {this.getActionConfirmationDialog("Database update", "Are you sure you want to update the database?", "update")}
          {this.getActionConfirmationDialog("Database repair", "Are you sure you want to repair the database?", "repair")}
          {this.getActionConfirmationDialog("Database init", "Are you sure you want to init the database?", "init")}
      </div>
    );
  }

  getActionConfirmationDialog(title, body, action) {
    return (
      <Modal show={this.state.openDialog === `${action}`} onHide={this.handleCloseActionConfirmation.bind(this)}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{body}</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={this.handleCloseActionConfirmation.bind(this)}>No</button>
          <button className="nemesis-button success-button" onClick={this.handleConfirmationActionButtonClick.bind(this, action)}>Yes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  onActionButtonClick(actionId) {
    this.setState({openDialog: actionId});
  }


  handleCloseActionConfirmation() {
    this.setState({openDialog: ''})
  }

  handleConfirmationActionButtonClick(action) {
    PlatformApiCall.post(`database/${action}`).then(() => {
     this.setState({openDialog: ''}, () => {
       this.onActionSuccess(action);
     });
    }, err => {
     this.onActionFail(action, err);
     this.setState({openDialog: ''});
    })
  }

  buildPageObject(totalElements, pageSize, pageNumber) {
    let totalPages = Math.floor(totalElements / pageSize);
    if (totalElements % pageSize > 0) {
      totalPages++;
    }

    let result = {
      number: pageNumber,
      size: pageSize,
      totalElements: totalElements,
      totalPages: totalPages
    };

    return result;
  }

  onPagerChange(page, pageSize) {
    let pageObject = this.buildPageObject(this.state.filteredMigrations.length, pageSize, page);
    this.setState({...this.state, page: pageObject});
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let filteredMigrations = this.state.migrations;
    if (searchValue) {
      filteredMigrations = filteredMigrations.filter(migration => migration.description.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
    }

    let pageObject = this.buildPageObject(filteredMigrations.length, this.state.page.size, 0);
    this.setState({...this.state, filteredMigrations: filteredMigrations, page: pageObject});
  }

  getMigrationsForPage() {
    let skippedPages = this.state.page.number * this.state.page.size;
    return _.slice(this.state.filteredMigrations, skippedPages, skippedPages + this.state.page.size);
  }

  onActionSuccess(action) {
     this.props.openNotificationSnackbar('Platform ' + action + ' started!');
  }

  onActionFail(action, err) {
     this.props.openNotificationSnackbar('Could not start platform ' + action + '!', 'error');
  }
}
