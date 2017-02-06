import React, { Component } from 'react';
import { componentRequire } from '../../../utils/require-util';
import {Tabs, Tab} from 'material-ui/Tabs';

export default class EntitySection extends Component {
  constructor(props) {
    super(props);

    this.state = { sectionIndex: 0 };
  }

  handleChange = (value) => {
    this.setState({
      sectionIndex: value,
    });
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <Tabs onChange={this.handleChange}
              value={this.state.sectionIndex}>
              {this.props.entity.data.sections.map((item, index) => {
                return <Tab key={index} value={index} label={item.title}></Tab>
              })}
        </Tabs>

      </div>
    )
  }
}