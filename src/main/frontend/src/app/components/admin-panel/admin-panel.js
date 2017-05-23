import React, {Component} from 'react';
import ApiCall from '../../services/api-call';
import axios from 'axios';
import AdminActions from './admin-actions';
import AdminHealth from './admin-health';
import AdminInfo from './admin-info';
import '../../../styles/admin-panel.less';
import AdminImport from "./admin-import";

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // axios({
    //   url: 'stomp/info',
    //   method: 'GET',
    //   baseURL: 'https://localhost:8112/storefront/platform/',
    //   headers: ApiCall.getHeaders(),
    // }).then(console.log);
    //
    // axios({
    //   url: 'health',
    //   method: 'GET',
    //   baseURL: 'https://localhost:8112/storefront/platform/',
    //   headers: ApiCall.getHeaders(),
    // }).then(console.log);
  }

  render() {
    return (
      <div className="nemesis-admin-panel">
        <AdminActions />
        <AdminHealth />
        <AdminInfo />
        <AdminImport />
      </div>
    );
  }
}