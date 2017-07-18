import React, {Component} from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';

const style = {
  top: 0,
  left: 350,
  lineHeight: '24px'
};

const radialBardata = [
  {name: '18-24', uv:31.47, pv: 2400, fill: '#8884d8'},
  {name: '25-29', uv:26.69, pv: 4567, fill: '#83a6ed'},
  {name: '30-34', uv:15.69, pv: 1398, fill: '#8dd1e1'},
  {name: '35-39', uv:8.22, pv: 9800, fill: '#82ca9d'},
  {name: '40-49', uv:8.63, pv: 3908, fill: '#a4de6c'},
  {name: '50+', uv:2.63, pv: 4800, fill: '#d0ed57'},
  {name: 'unknown', uv:6.67, pv: 4800, fill: '#ffc658'}
];

const areaChartData = [
  {name: 'January', users:4000, pv: 2400, amt: 2400},
  {name: 'February', users:3000, pv: 1398, amt: 2210},
  {name: 'March', users:2000, pv: 9800, amt: 2290},
  {name: 'April', users:2780, pv: 3908, amt: 2000},
  {name: 'May', users:1890, pv: 4800, amt: 2181},
  {name: 'June', users:2390, pv: 3800, amt: 2500},
  {name: 'July', users:3490, pv: 8710, amt: 2100},
  {name: 'August', users:3911, pv: 4300, amt: 2100},
  {name: 'September', users:2154, pv: 4300, amt: 2100},
  {name: 'October', users:2000, pv: 4300, amt: 2100},
  {name: 'November', users:2900, pv: 4300, amt: 2100},
  {name: 'December', users:3200, pv: 4300, amt: 2100},
];

const data01 = [
  {name: 'Unisex', value: 600, fill: '#82ca9d'},
  {name: 'Male', value: 300, fill: '#003366'},
  {name: 'Women', value: 300, fill: '#ff69b4'},
  {name: 'Kids', value: 200, fill: '#ff6600'}
];

const data02 = [{name: 'Red', value: 100, fill: '#e52c0a'},
  {name: 'Green', value: 300, fill: '#a4de6c'},
  {name: 'Silver', value: 100, fill: '#C0C0C0'},
  {name: 'Blue', value: 80, fill: '#83a6ed'},
];

const barData = [
  {name: '1st week', Paid: 4000, Canceled: 2400, amt: 2400},
  {name: '2nd week', Paid: 3000, Canceled: 1398, amt: 2210},
  {name: '3rd week', Paid: 2000, Canceled: 9800, amt: 2290},
  {name: '4rd week', Paid: 2780, Canceled: 3908, amt: 2000},
];

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {areaChartData: areaChartData};
  }

  render() {
    return (
      <div className="admin-panel">
        <div className="admin-info-panel-container">
          <div className="admin-info-panel display-table">
            <div className="display-table-cell info-panel-icon">
              <i className="material-icons">person</i>
            </div>
            <div className="display-table-cell info-panel-text">
              <div className="info-panel-count">1388</div>
              <div className="info-panel-type">Users</div>
            </div>
          </div>

          <div className="admin-info-panel display-table">
            <div className="display-table-cell info-panel-icon">
              <i className="material-icons">shopping_cart</i>
            </div>
            <div className="display-table-cell info-panel-text">
              <div className="info-panel-count">27013</div>
              <div className="info-panel-type">Orders</div>
            </div>
          </div>

          <div className="admin-info-panel display-table">
            <div className="display-table-cell info-panel-icon">
              <i className="material-icons">attach_money</i>
            </div>
            <div className="display-table-cell info-panel-text">
              <div className="info-panel-count">7610</div>
              <div className="info-panel-type">Payments</div>
            </div>
          </div>

          <div className="admin-info-panel display-table">
            <div className="display-table-cell info-panel-icon">
              <i className="material-icons">done_all</i>
            </div>
            <div className="display-table-cell info-panel-text">
              <div className="info-panel-count">13827</div>
              <div className="info-panel-type">Products</div>
            </div>
          </div>
        </div>
        <div className="admin-small-chart-container">
          <div className="small-chart-container">
            <RadialBarChart width={500} height={250} cx={150} cy={150} innerRadius={20} outerRadius={140} barSize={10}
                            data={radialBardata}>
              <RadialBar minAngle={15} label background clockWise={true} dataKey='uv'/>
              <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle'
                      wrapperStyle={style}/>
            </RadialBarChart>
          </div>

          <div className="small-chart-container">
            <BarChart width={500} height={200} data={barData}
                      margin={{top: 20, right: 30, left: 20, bottom: 5}}>
              <XAxis dataKey="name"/>
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8"/>
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d"/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend />
              <Bar yAxisId="left" dataKey="Paid" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="Canceled" fill="#82ca9d" />
            </BarChart>
          </div>
          <div className="small-chart-container">
            <PieChart width={400} height={250}>
              <Pie dataKey="value" data={data01} cx={150} cy={100} outerRadius={60} fill="#8884d8"/>
              <Pie dataKey="value" data={data02} cx={150} cy={100} innerRadius={70} outerRadius={90} fill="#82ca9d" label/>
              <Legend iconSize={10} width={120} height={140} layout='vertical' horizontalAligh='left' verticalAlign='top' wrapperStyle={style}/>
            </PieChart>
          </div>
        </div>
        <div className="big-chart-container">
          <AreaChart width={1000} height={300} data={this.state.areaChartData}
                     style={{margin: 'auto'}}
                     margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Area type='monotone' dataKey='users' stroke='#8884d8' fill='#8884d8'/>
          </AreaChart>
        </div>
      </div>
    );
  }

}