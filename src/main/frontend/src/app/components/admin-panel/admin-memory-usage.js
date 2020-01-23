import React, {Component} from 'react';
import PlatformApiCall from '../../services/platform-api-call';
import {LineChart, Line, XAxis, YAxis, CartesianGrid} from  'recharts';

export default class AdminMemoryUsage extends Component {
  constructor(props) {
    super(props);
    this.state = {totalMemory: 0, memoryData: this.generateInitialData()};
    this.intervalUpdate = null;
  }

  componentDidMount() {
    PlatformApiCall.get('metrics/mem').then(result => {
      this.setState({...this.state, totalMemory: result.data.mem})
    }).then(() => {
      this.intervalUpdate = setInterval(() => {
        this.updateMemoryData();
      }, 2000)
    });
  }

  render() {
    return (
      <div className="paper-box">
        <div>memory usage {this.state.totalMemory}</div>
        <div>
          <LineChart width={900} height={300} data={this.state.memoryData}
                     margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="name" tick={null}/>
            <YAxis domain={[0, 100]}/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Line isAnimationActive={false} type="linear" dataKey="percentUsage" stroke="#8884d8"/>
          </LineChart>
        </div>
      </div>
    );
  }

  updateMemoryData() {
    PlatformApiCall.get('metrics/mem.free').then(result => {
      let currentPercents = (result.data['mem.free'] / this.state.totalMemory) * 100;
      let newMemoryData = [{name: 0, percentUsage: currentPercents}];
      for (let i = 0; i < 29; i++) {
        let currentMemoryData = {name: i + 1};
        if (this.state.memoryData[i].percentUsage) {
          currentMemoryData.percentUsage = this.state.memoryData[i].percentUsage;
        }
        newMemoryData.push(currentMemoryData);
      }
      this.setState({...this.state, memoryData: newMemoryData});
    });
  }

  generateInitialData() {
    let result = [];
    for (let i = 0; i < 30; i++) {
      result.push({name: i})
    }

    return result;
  }

  componentWillUnmount() {
    clearInterval(this.intervalUpdate);
  }
}