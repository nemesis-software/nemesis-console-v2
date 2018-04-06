import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';
import _ from 'lodash';
import counterpart from 'counterpart';

import EntitiesPager from '../entity-window/entities-viewer/entities-pager/entities-pager';

export default class AdminSpringBeans extends Component {
  constructor(props) {
    super(props);
    this.state = {context: '', beans: [], filteredBeans: [], page: {}};
  }

  componentWillMount() {
    PlatformApiCall.get('beans').then(result => {

      let beansObj = this.findBeans(result.data);
      let beans = [];
      _.forIn(beansObj, (value, key) => {
        let resultBean = {...value, bean: key};
        beans.push(resultBean);
      });
      this.setState({
        context: result.data.contextId,
        beans: beans,
        filteredBeans: beans,
        page: this.buildPageObject(beans.length, 20, 0)
      });
    })
  }

  findBeans(data) {
    if (data.beans) {
      return data.beans;
    }

    let beans = null;
    _.forIn(data, (value, key) => {
      if (!beans) {
        beans = this.findBeans(value);
      }
    });

    return beans;
  }

  render() {
    return (
      <div className="paper-box">
        Beans {this.state.context}
        <EntitiesPager onPagerChange={this.onPagerChange.bind(this)}  page={this.state.page} />
        <div className="input-group">
          <input type="text"
                 placeholder={counterpart.translate('main.Filter...', {fallback: 'Filter'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search" /></span>
        </div>
        <div>
          <table style={{width: '100%', tableLayout: 'fixed'}} className="table table-striped">
            <thead>
              <tr>
                <th>Bean</th>
                <th>Scope</th>
                <th>Type</th>
                <th>Resource</th>
                <th>Dependencies</th>
              </tr>
            </thead>
            <tbody>
            {
              this.getBeansForPage().map((item, index) => {
                return (
                  <tr key={index}>
                    <td style={{wordWrap: 'break-word'}}>{item.bean}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.scope}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.type}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.resource}</td>
                    <td style={{wordWrap: 'break-word'}}>{item.dependencies.join(', ')}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    );
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
    let pageObject = this.buildPageObject(this.state.filteredBeans.length, pageSize, page);
    this.setState({...this.state, page: pageObject});
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let filteredBeans = this.state.beans;
    if (searchValue) {
      filteredBeans = filteredBeans.filter(bean => bean.bean.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
    }

    let pageObject = this.buildPageObject(filteredBeans.length, this.state.page.size, 0);
    this.setState({...this.state, filteredBeans: filteredBeans, page: pageObject});
  }

  getBeansForPage() {
    let skippedPages = this.state.page.number * this.state.page.size;
    return _.slice(this.state.filteredBeans, skippedPages, skippedPages + this.state.page.size);
  }
}