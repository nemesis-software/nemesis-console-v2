import React, {Component} from 'react';
import AdminActions from './admin-actions';
import AdminHealth from './admin-details/admin-health';
import AdminInfo from './admin-details/admin-info';
import '../../../styles/admin-panel.less';
import AdminImport from './admin-import';
import AdminMemoryUsage from './admin-memory-usage';
import AdminSpringBeans from './admin-spring-beans';
import AdminIdAnalyzer from './admin-id-analyzer';
import AdminSystemProperties from './admin-system-properties/admin-system-properties';
import AdminThreads from './admin-threads/admin-threads'
import AdminDetails from './admin-details/admin-details';

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="nemesis-admin-panel">
        <AdminDetails />
        {/*<AdminThreads />*/}
        {/*<AdminSystemProperties />*/}
        {/*<AdminIdAnalyzer/>*/}
        {/*<AdminSpringBeans />*/}
        {/*<AdminActions />*/}
        {/*<AdminImport />*/}
        {/*<AdminMemoryUsage />*/}
      </div>
    );
  }
}