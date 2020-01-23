import React, {Component} from 'react';
import '../../../styles/kie-panel.less';
import ApiCall from '../../services/api-call';
import Modal from 'react-bootstrap/lib/Modal';
import FormControl from 'react-bootstrap/lib/Form';
import DataHelper from 'servicesDir/data-helper';
import {componentRequire} from "../../utils/require-util";
import NotificationSystem from 'react-notification-system';
import counterpart from "counterpart";

export default class KieModules extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = null;
    this.state = {modules: [], filteredModules: [], page:{}};
  }

  componentDidMount() {
    ApiCall.get('kie_module').then(result => {
      let modules = DataHelper.mapCollectionData(result.data);
      this.setState({modules: modules, filteredModules:modules, page: this.buildPageObject(modules.length, 5, 0)});
    });

    this.notificationSystem = this.refs.notificationSystem;
  }

  onChange = e => {
    var m = this.state.modules;
    m[e.target.dataset.index][e.target.dataset.input] = e.target.value;
    this.setState({modules:m});
  };

  render() {
    return (
      <div className="admin-caches">
        <h4>KIE Modules:</h4>
        <div className="input-group" style={{marginBottom: '10px'}}>
          <input type="text"
                 placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search" /></span>
        </div>
        <div className="admin-cache-panel paper-box">
            {this.state.isLoading ? <div className="loading-screen">
              <i className="material-icons loading-icon">cached</i>
            </div> : false}
            <div className="display-table" style={{width: '100%'}}>
              {this.getModulesForPage().map((module, index) => {
                return <div className="display-table-row" key={module.code}>
                  <div className="display-table-cell">{module.code}</div>
                  <div className="display-table-cell"><div className="input-group"><input type="text" placeholder="Group ID"
                  className="form-control" data-index={index} data-input="groupId" value={module.groupId || ""} onChange={this.onChange}/></div></div>
                  <div className="display-table-cell"><div className="input-group"><input type="text"
                  placeholder="Artifact ID" className="form-control" data-index={index} data-input="artifactId" value={module.artifactId || ""} onChange={this
                  .onChange}/></div></div>
                  <div className="display-table-cell"><div className="input-group"><input type="text" placeholder="Version" className="form-control"
                   data-index={index} data-input="version" value={module.version || ""} onChange={this.onChange}/></div></div>
                  <div className="display-table-cell" style={{textAlign: 'right'}}>
                    <button className="nemesis-button success-button" onClick={() => this.onSaveKIEModule(module.id, index)}>Save</button>
                    <button className="nemesis-button success-button" onClick={() => this.onBuildKIEModule(module.code)}>Build</button>
                  </div>
                </div>
              })}
            </div>
          </div>
          <NotificationSystem ref="notificationSystem"/>
      </div>
    );
  }

  onSaveKIEModule(kieModuleId, index) {
      var self = this;
      this.setState({...this.state, isLoading: true});
      ApiCall.patch("kie_module/" + kieModuleId + "/", {
        'groupId':this.state.modules[index].groupId,
        'artifactId':this.state.modules[index].artifactId,
        'version':this.state.modules[index].version
      }).then(
        () => {
          self.openNotificationSnackbar("Saved successfully!");
          this.setState({...this.state, isLoading: false});
        },
        err => {
          self.openNotificationSnackbar("Save failed!", "error");
          this.setState({...this.state, isLoading: false});
        }
      );
  }

  onBuildKIEModule(kieModuleCode) {
    var self = this;
    this.setState({...this.state, isLoading: true});
    ApiCall.post("/kie/module/" + kieModuleCode + "/", {
    }).then(
      () => {
        self.openNotificationSnackbar("Built successfully!");
        this.setState({...this.state, isLoading: false});
      },
      err => {
        self.openNotificationSnackbar("Build failed!", "error");
        this.setState({...this.state, isLoading: false});
      }
    );
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let filteredModules = this.state.modules;
    if (searchValue) {
      filteredModules = filteredModules.filter(module => module.artifactId.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
    }

    let pageObject = this.buildPageObject(filteredModules.length, this.state.page.size, 0);
    this.setState({...this.state, filteredModules: filteredModules, page: pageObject});
  }

  getModulesForPage() {
    let skippedPages = this.state.page.number * this.state.page.size;
    return _.slice(this.state.filteredModules, skippedPages, skippedPages + this.state.page.size);
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

  openNotificationSnackbar(message, level) {
      this.notificationSystem.addNotification({
        message: message,
        level: level || "success",
        position: "tc"
      });
  }

}
