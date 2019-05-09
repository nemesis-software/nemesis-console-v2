import React, {Component} from 'react';

import _ from 'lodash';

import counterpart from 'counterpart';

import MasterAdminConfiguration from '../master-admin-configuration/master-admin-configuration';

import Translate from 'react-translate-component';

import ApiCall from 'servicesDir/api-call';
import DataHelper from 'servicesDir/data-helper';


export default class AllFieldsConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {allFields: {}, allFieldsKey: [], filteredFieldsKey: [], filterValue: ''};
  }

  componentWillMount() {
    ApiCall.get('markup/entity/fields').then(result => {
      this.setState({
        allFields: result.data,
        allFieldsKey: this.parseFieldsKey(result.data),
        filteredFieldsKey: this.parseFieldsKey(result.data),
        selectedFieldData: null,
        selectedFieldKey: null
      });
    })
  }

  render() {
    if (this.state.selectedFieldData) {
      return (
        <MasterAdminConfiguration handleBackButton={this.handleBackButton.bind(this)}
                                  openNotificationSnackbar={this.props.openNotificationSnackbar}
                                  entityName={this.state.selectedFieldKey}
                                  allFields={this.state.allFields[this.state.selectedFieldKey]}
                                  fieldData={this.state.selectedFieldData}/>
      )
    } else {
      return (
        <div className="all-fields-configuration">
          <div className="input-group" style={{padding: '20px 10px'}}>
            <input type="text"
                   placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                   className="form-control"
                   value={this.state.filterValue}
                   onChange={this.onFilterChange.bind(this)}/>
            <span className="input-group-addon"><i className="fa fa-search"/></span>
          </div>
          <div className="fields-container">
            {this.state.filteredFieldsKey.map(field => {
              return <Translate onClick={() => this.onFieldSelect(field)} component="div" content={'main.' + field} fallback={field} key={field}
                                className="field-key-container"/>
            })}
          </div>
        </div>
      )
    }
  }

  parseFieldsKey(allFields) {
    return _.keys(allFields);
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let regex = new RegExp(searchValue, 'i');
    let result = _.filter(this.state.allFieldsKey, key => {
      return regex.test(counterpart.translate('main.' + key))
    });

    this.setState({filteredFieldsKey: result, filterValue: searchValue});
  }

  onFieldSelect(field) {
    ApiCall.get('entity_property_config/search/findByAbstractEntityName', {abstractEntityName: field}).then(result => {
      this.setState({selectedFieldKey: field, selectedFieldData: DataHelper.mapCollectionData(result.data)});
    }, (err) => {
      if (err.response.status === 404) {
        this.setState({selectedFieldKey: field, selectedFieldData: []});
      } else {
        console.log(err);
      }
    });
  }

  handleBackButton() {
    this.setState({selectedFieldKey: null, selectedFieldData: null});
  }
}
