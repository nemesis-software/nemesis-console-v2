import React, {Component} from 'react';
import '../../../styles/kie-panel.less';
import ApiCall from '../../services/api-call'
import {Modal} from 'react-bootstrap';
import Switch from 'rc-switch';
import DataHelper from 'servicesDir/data-helper';
import {componentRequire} from "../../utils/require-util";
import NotificationSystem from 'react-notification-system';
import NemesisEntityField from "../field-components/nemesis-entity-field/nemesis-entity-field";
import counterpart from "counterpart";

export default class KieContainers extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = null;
    this.state = {containers: [], filteredContainers: [], resetBeforeUpdate: [], page: {}};
  }

  componentDidMount() {
    ApiCall.get('kie/containers').then(result => {
      this.setState({containers: result.data, filteredContainers: result.data, page: this.buildPageObject(result.data.length, 5, 0)});
    });

    this.notificationSystem = this.refs.notificationSystem;
  }

  onChange = e => {
    var m = this.state.containers;
    m[e.target.dataset.index]['releaseId'][e.target.dataset.input] = e.target.value;
    this.setState({containers:m});
  };

  onResetBeforeUpdateClicked = e => {
    var resetBeforeUpdate = this.state.resetBeforeUpdate;
    resetBeforeUpdate[e.target.dataset.index] = e.target.checked;
    this.setState({ resetBeforeUpdate:resetBeforeUpdate});
  }


  render() {
    return (
      <div className="admin-caches">
        <NotificationSystem ref="notificationSystem"/>
        {this.state.isLoading ? <div className="loading-screen">
          <i className="material-icons loading-icon">cached</i>
        </div> : false}
        <h4>KIE Containers:</h4>
        <div>
            <div className="input-group" style={{marginBottom: '10px'}}>
              <input type="text"
                     placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                     className="form-control"
                     onChange={this.onFilterChange.bind(this)}/>
              <span className="input-group-addon"><i className="fa fa-search"/></span>
              <span className="input-group-addon"><i className="fas fa-plus" onClick={this.onAddContainer.bind(this)}/></span>
            </div>
        </div>
         {this.state.containers.length > 0 && <div className="admin-cache-panel paper-box">
            <div className="display-table table-striped" style={{width: '100%'}}>
              <div className="display-table-row">
                 <div className="display-table-cell header">Status</div>
                 <div className="display-table-cell header">Name</div>
                 <div className="display-table-cell header">GroupId</div>
                 <div className="display-table-cell header">ArtifactId</div>
                 <div className="display-table-cell header">Version</div>
                 <div className="display-table-cell header">Reset Before Update</div>
                 <div className="display-table-cell header" style={{textAlign: 'center'}}>Actions</div>
              </div>
              {this.getContainersForPage().map((container, index) => {
                return <div className="display-table-row" key={container.containerId}>
                  <div className="display-table-cell"><div className={"health-status-dot" + (container.status === 'STARTED' ? ' online' : ' offline')}>&nbsp;
                  </div></div>
                  <div className="display-table-cell">{container.containerId}</div>
                  <div className="display-table-cell"><div className="input-group"><input type="text" placeholder="Group ID"
                        data-index={index} data-input="groupId" value={container.releaseId.groupId || ""} onChange={this.onChange} className="form-control"/></div></div>
                  <div className="display-table-cell"><div className="input-group"><input type="text" placeholder="Artifact ID"
                        data-index={index} data-input="artifactId" value={container.releaseId.artifactId || ""} onChange={this.onChange}
                        className="form-control"/></div></div>
                  <div className="display-table-cell"><div className="input-group"><input type="text" placeholder="Version"
                        data-index={index} data-input="version" value={container.releaseId.version || ""} onChange={this.onChange}
                        className="form-control"/></div></div>
                  <div className="display-table-cell"><div className="input-group"><input type="checkbox" style={{background: 'white'}}
                                                    className={"select-entity-checkbox nemesis-checkbox " + (this.state.resetBeforeUpdate[index] ? 'active' : '')}
                                                    data-index={index} onChange={this.onResetBeforeUpdateClicked}
                                                    value={this.state.resetBeforeUpdate[index]}/></div></div>

                  <div className="display-table-cell" style={{textAlign: 'right'}}>
                    <div className="cache-active-container">
                      <label htmlFor={container.containerId}>Active</label><span>{container.status === 'STARTED'}</span>
                      <Switch id={container.containerId} defaultChecked={container.status === 'STARTED'} onChange={() => this.handleActiveButtonClick(container
                      .containerId, container.status)}/>
                    </div>
                    <button className="nemesis-button success-button" onClick={() => this.onUpdateReleaseIDClick(container.containerId, index)}>Update
                    ReleaseID</button>
                    <button className="nemesis-button danger-button" onClick={() => this.onDisposeClick(container.containerId)}>Dispose</button>
                  </div>
                </div>
              })}
            </div>
          </div>
         }
          {this.getDeleteConfirmationDialog()}
          {this.getAddContainerDialog()}
      </div>
    );
  }

  getAddContainerDialog() {
    return (
      <Modal show={this.state.openAddContainer} onHide={this.handleCloseAddContainer.bind(this)}>
        {this.state.isLoading ? <div className="loading-screen">
          <i className="material-icons loading-icon">cached</i>
        </div> : false}
        <Modal.Header>
          <Modal.Title>Create Container</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="input-group"><label>Container ID:</label><input type="text" placeholder="Container ID" className="form-control" onChange={this
            .onKieContainerIdChange}/></div>
          </div>
          <div>
            <div className="input-group"><NemesisEntityField
                                                   entityId={"kie_module"}
                                                   onValueChange={this.onKieModuleSelect.bind(this)}
                                                   value={this.state.selectedKieModule}
                                                   label={"KIE Module"}
                                                 />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={this.handleCloseAddContainer.bind(this)}>No</button>
          <button className="nemesis-button success-button" onClick={this.handleAddContainerButtonClick.bind(this)}>Yes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  getDeleteConfirmationDialog() {
    return (
      <Modal show={this.state.openDeleteConfirmation} onHide={this.handleCloseDeleteConfirmation.bind(this)}>
        <Modal.Header>
          <Modal.Title>Dispose Container</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to dispose it?</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="nemesis-button decline-button" style={{marginRight: '15px'}} onClick={this.handleCloseDeleteConfirmation.bind(this)}>No</button>
          <button className="nemesis-button success-button" onClick={this.handleConfirmationDeleteButtonClick.bind(this)}>Yes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  onKieContainerIdChange = e => {
    this.setState({kieContainerId:e.target.value});
  };


  onAddContainer() {
    this.setState({openAddContainer: true});
  }

  handleCloseAddContainer() {
    this.setState({openAddContainer: false})
  }

  handleActiveButtonClick(containerId, status) {
    var self = this;
    this.setState({...this.state, isLoading: true});
    ApiCall.put(`kie/container/${containerId}/status/${status==="STARTED"? 'deactivated' : 'activated'}`, {}, {}, "application/json").then((result) => {
      var containers = this.state.containers;
      containers.forEach((item, i)=> {if(item.containerId === result.data.containerId) {containers[i]=result.data}});
      this.setState({containers:containers}, () => {
        this.setState({...this.state, isLoading: false});
        self.openNotificationSnackbar('Container status changed!');
      });
    }, err => {
      self.openNotificationSnackbar('Could not change the status of the container! ' + err.response.data, 'error');
      this.setState({...this.state, isLoading: false});
    })

  }

  handleAddContainerButtonClick() {
    var self = this;
    this.setState({...this.state, isLoading: true});
    ApiCall.put(`kie/container/${this.state.kieContainerId}`, {}, {'moduleCode':this.state.selectedKieModule.code}, "application/json").then((result) => {
      var containers = this.state.containers;
      containers.push(result.data);
      this.setState({openAddContainer: false, containers:containers}, () => {
        this.setState({...this.state, isLoading: false});
        self.openNotificationSnackbar('Container created!');
      });
    }, err => {
      self.openNotificationSnackbar('Could not create the container! ' + err.response.data, 'error');
      this.setState({...this.state, isLoading: false});
      this.setState({openAddContainer: false});
    })
  }

  handleConfirmationDeleteButtonClick() {
    var self = this;
    ApiCall.delete(`kie/container/${this.state.containerForDispose}`, {}).then(() => {
      var containers = this.state.containers.filter(function( container ) {
        return container.containerId !== self.state.containerForDispose;
      });
      this.setState({openDeleteConfirmation: false, containers:containers}, () => {
        self.openNotificationSnackbar('Container disposed!');
      });
    }, err => {
      self.openNotificationSnackbar('Could not dispose the container! ' + err.response.data, 'error');
      this.setState({openDeleteConfirmation: false});
    })
  }

  onDisposeClick(containerId) {
    this.setState({openDeleteConfirmation: true, containerForDispose: containerId});
  }

  onUpdateReleaseIDClick(containerId, index) {
    var self = this;
    this.setState({...this.state, isLoading: true});
    ApiCall.post(`/kie/containers/${containerId}/release-id`, {"groupId":this.state.containers[index]['releaseId'].groupId, "artifactId":this.state
    .containers[index]['releaseId'].artifactId, "version":this.state.containers[index]['releaseId'].version},
    "application/json", {"resetBeforeUpdate":this.state.resetBeforeUpdate[index]}).then(()=>
    {
      this.setState({}, () => {
        this.setState({...this.state, isLoading: false});
        self.openNotificationSnackbar('Updated ReleaseID successfully!');
      });
    }, err => {
      this.setState({...this.state, isLoading: false});
      self.openNotificationSnackbar('Could not update ReleaseID!'+ err.response.data, 'error');
    })

  }

  handleCloseDeleteConfirmation() {
    this.setState({openDeleteConfirmation: false})
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let filteredContainers = this.state.containers;
    if (searchValue) {
      filteredContainers = filteredContainers.filter(container => container.containerId.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
    }

    let pageObject = this.buildPageObject(filteredContainers.length, this.state.page.size, 0);
    this.setState({...this.state, filteredContainers: filteredContainers, page: pageObject});
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

  onKieModuleSelect(value) {
    if (value) {
      this.setState({ selectedKieModule: value });
      return;
    }
  }

  getContainersForPage() {
    let skippedPages = this.state.page.number * this.state.page.size;
    return _.slice(this.state.filteredContainers, skippedPages, skippedPages + this.state.page.size);
  }

  openNotificationSnackbar(message, level) {
      this.notificationSystem.addNotification({
        message: message,
        level: level || "success",
        position: "tc"
      });
  }
}

