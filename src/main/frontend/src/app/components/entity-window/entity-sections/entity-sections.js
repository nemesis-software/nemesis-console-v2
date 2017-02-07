import React, { Component } from 'react';
import { componentRequire } from '../../../utils/require-util';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import EntitySection from './entity-section/entity-section';

export default class EntitySections extends Component {
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
    return (
      <div>
        <Tabs onChange={this.handleChange}
              value={this.state.sectionIndex}>
              {this.props.entity.data.sections.map((item, index) => {
                return <Tab key={index} value={index} label={item.title} />
              })}
        </Tabs>
        <SwipeableViews
          index={this.state.sectionIndex}
          onChangeIndex={this.handleChange}
        >
          {this.props.entity.data.sections.map((item, index) => {
            return <EntitySection key={index} section={item} entityData={this.props.entityData} />
          })}
        </SwipeableViews>
      </div>
    )
  }
}