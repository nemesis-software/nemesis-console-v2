import React, {Component} from 'react';

import ApiCall from 'servicesDir/api-call'
import DataHelper from "../../../services/data-helper";

import Translate from 'react-translate-component';
import counterpart from "counterpart";
import EntityConfigItem from "./entity-config-item";

export default class MasterAdminNavigationConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {configs: [], filteredConfigs: [], filterInput: '', selectedConfig: null}
  }

  componentWillMount() {
    this.getFieldsData();
  }


  render() {
    if (!this.state.selectedConfig) {
      return (
        <div className="all-fields-configuration">
          <button style={{margin: '10px'}} className="nemesis-button success-button" onClick={() => this.setState({selectedConfig: {id: null}})}>Create new</button>
          <div className="input-group" style={{padding: '20px 10px'}}>
            <input type="text"
                   placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                   className="form-control"
                   value={this.state.filterInput}
                   onChange={this.onFilterChange.bind(this)}/>
            <span className="input-group-addon"><i className="fa fa-search"/></span>
          </div>
          <div className="fields-container">
            {this.state.filteredConfigs.map(field => {
              return <Translate onClick={() => this.onFieldSelect(field)} component="div" content={'main.' + field.code} fallback={field.code} key={field.code}
                                className="field-key-container"/>
            })}
          </div>
        </div>
      )
    }

    return (
      <EntityConfigItem reloadData={this.getFieldsData.bind(this)} handleBackButton={() => this.setState({selectedConfig: null})} openNotificationSnackbar={this.props.openNotificationSnackbar} config={this.state.selectedConfig}/>
    )

  }


  onFieldSelect(config) {
    this.setState({selectedConfig: config});
  }

  onFilterChange(ev) {
    this.setState({filterInput: ev.target.value}, () => {
      this.setState({filteredConfigs: this.getFilteredData(this.state.configs)})
    })
  }

  onDeleteField() {
    this.getFieldsData();
  }

  getFieldsData() {
    ApiCall.get('entity_config', {page: 0, size: 10000}).then(result => {
      let data = DataHelper.mapCollectionData(result.data);
      this.setState({configs: data, filteredConfigs: this.getFilteredData(data), selectedConfig: null});
    })
  }

  getFilteredData(data) {
    if (this.state.filterInput) {
      return data.filter(item => {
        return item.code.toLowerCase().indexOf(this.state.filterInput.toLowerCase()) > -1;
      })
    }

    return data;
  }

}