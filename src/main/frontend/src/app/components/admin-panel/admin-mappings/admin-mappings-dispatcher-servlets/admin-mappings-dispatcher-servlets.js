import React, {Component} from 'react';
import AdminMappingsDispatcherServletsItem from "./admin-mappings-dispatcher-servlets-item";
import counterpart from "counterpart";


export default class AdminMappingsDispatcherServlets extends Component {
  constructor(props) {
    super(props);
    this.state = {dispatcherServlets: props.data || []};
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data)) {
      console.log(nextProps.data);
      this.setState({dispatcherServlets: nextProps.data});
    }
  }

  render() {
    return (
      <div className="admin-mappings-dispatcher-servlets">
        <div className="input-group">
          <input type="text"
                 placeholder={counterpart.translate('main.filterServletMappings', {fallback: 'Filter servlet mappings'})}
                 className="form-control"
                 onChange={this.onFilterChange.bind(this)}/>
          <span className="input-group-addon"><i className="fa fa-search"/></span>
        </div>
        {this.state.dispatcherServlets.map((servlet,index) => <AdminMappingsDispatcherServletsItem key={index} servlet={servlet}/>)}
      </div>
    );
  }

  onFilterChange(ev) {
    let searchValue = ev.target.value;
    let dispatcherServlets = this.props.data;
    if (searchValue) {
      dispatcherServlets = dispatcherServlets.filter(servlet => {
        return servlet.predicate.indexOf(searchValue) > -1;
      })
    }

    this.setState({dispatcherServlets: dispatcherServlets});
  }
}