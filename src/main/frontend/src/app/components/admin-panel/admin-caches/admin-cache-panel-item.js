import React, {Component} from 'react';
import Switch from 'rc-switch';
import PlatformApiCall from 'servicesDir/platform-api-call';

export default class AdminCachePanelItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isExpanded: false, isEmpty: false, cacheEntries: []};
  }

  render() {
    return (
      <div className={'display-table-row' + (this.state.isExpanded ? ' cache-details-expanded' : '')}>
        <div className="display-table">
            <div className="display-table-row">
                <div className="display-table-cell" onClick={() => this.fetchCacheEntries(this.props.cache.name)}>
                  <span className={!this.props.cache.isEmpty ? "cache-header-empty-status" : ""}>{this.props.cache.name}</span>
                  {/*<span className="display-table-cell"><span className={'admin-thread-state ' + (this.props.thread.threadState === 'RUNNABLE' ? 'runnable' : 'waiting')}>{this.props.thread.threadState}</span></span>*/}
                </div>
                <div className="display-table-cell" style={{textAlign: 'right'}}>
                    <div className="cache-active-container">
                      <label htmlFor={this.props.cache.name}>Active</label><span>{this.props.cache.enabled}</span>
                      <Switch id={this.props.cache.name} defaultChecked={this.props.cache.enabled} onChange={() => this.props.handleActiveButtonClick(this.props.cache.name)}/>
                    </div>
                    <button className="nemesis-button danger-button" onClick={() => this.props.onClearCacheClick(this.props.cache.name)}>Clear cache</button>
                </div>
            </div>
        </div>
        {this.state.isExpanded ?
          <div className="admin-cache-details">
              <div>
                {this.state.cacheEntries.length > 0 ?
                    this.state.cacheEntries.map((el, key) => {
                        return <div className="cache-entries" key={key}>
                            <div><b>Key:</b>{el[0]}</div>
                            <div><b>Value:</b>{el[1]}</div>
                        </div>;
                    })
                :<div className="cache-entries">Empty</div>}
              </div>
          </div>
          : false }
      </div>
    );
  }

  fetchCacheEntries(cacheName) {
    PlatformApiCall.get(`caches/${cacheName}`, {cacheManager: this.props.name}).then((res) => {
      let expanded = !this.state.isExpanded;
      this.setState({isExpanded: expanded, isEmpty: res.data.empty, cacheEntries: Object.entries(res.data.cacheEntries)});
    }, err => {
        console.log("Error getting the cache entries!");
    })
  }
}
