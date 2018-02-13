import React, {Component} from 'react';

import _ from 'lodash';

import counterpart from 'counterpart';


import Translate from 'react-translate-component';

import ApiCall from 'servicesDir/api-call';

export default class AllFieldsConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {allFields: {},allFieldsKey: [], filteredFieldsKey: []};
  }

  componentWillMount() {
    ApiCall.get('markup/entity/fields').then(result => {
      this.setState({allFields: result.data, allFieldsKey: this.parseFieldsKey(result.data), filteredFieldsKey: this.parseFieldsKey(result.data)});
    })
  }

  render() {
    return (
      <div className="all-fields-configuration">
        <div className="input-group" style={{padding: '20px 10px'}}>
          <input type="text"
                 placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search" /></span>
        </div>
        <div className="fields-container">
          {this.state.filteredFieldsKey.map(field => {
            return <Translate component="div" content={'main.' + field} fallback={field} key={field} className="field-key-container"/>
          })}
        </div>
      </div>
    )
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

    this.setState({filteredFieldsKey: result});
  }
}