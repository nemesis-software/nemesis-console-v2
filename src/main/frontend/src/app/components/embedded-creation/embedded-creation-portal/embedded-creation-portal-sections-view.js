import React, {Component} from 'react';

import _ from 'lodash';

import SwipeableViews from 'react-swipeable-views';

import Translate from 'react-translate-component';

import { componentRequire } from '../../../utils/require-util';
import PropTypes from "prop-types";

let EntitySection = componentRequire('app/components/entity-window/entity-sections/entity-section/entity-section', 'entity-section');

export default class EmbeddedCreationPortalSectionsView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      sectionIndex: 0,
      entityData: {},
      sections: context.entityMarkupData[props.entityId].sections
    };
    this.sectionsReferences = [];
  }

  componentWillMount() {
    this.sectionsReferences = [];
  }

  componentWillUpdate() {
    this.sectionsReferences = [];
  }

  render() {
    return (
      <div style={{verticalAlign: 'top'}}>
        <div className="section-navigation">
          {this.state.sections.map((item, index) => {
            return <div className={'section-navigation-item' + (this.state.sectionIndex === index ? ' active' : '')} onClick={() => this.handleChange(index)} key={index}><Translate component="span" content={'main.' + item.title} fallback={item.title} />{this.getRequiredStar(item.items)}</div>
          })}
        </div>
        <SwipeableViews
          index={this.state.sectionIndex}
          onChangeIndex={this.handleChange}
        >
          {this.state.sections.map((item, index) => {
            return <EntitySection ref={(section) => {section && this.sectionsReferences.push(section)}}
                                  key={index}
                                  section={item}
                                  entity={{entityName: this.props.entityId, entityId: this.props.entityId}}
                                  sectionIndex={index}
                                  entityData={this.state.entityData}
                                  onEntityItemClick={() => {}} />
          })}
        </SwipeableViews>
      </div>
    );
  }

  handleChange = (value) => {
    this.setState({
      ...this.state,
      sectionIndex: value,
    });
  };

  getRequiredStar(items) {
    if (_.some(items, {required: true})) {
      return <span className="required-star">*</span>;
    }

    return false;
  }

  getDirtyValues() {
    let result = [];
    this.sectionsReferences.forEach(section => {
      result = result.concat(section.getDirtyValues());
    });

    return result;
  }

  isFieldsValid() {
    let isValid = true;
    this.sectionsReferences.forEach(section => {
      if (!isValid) {
        return;
      }
      isValid = section.isFieldsValid();
      if (!isValid) {
        this.handleChange(section.getSectionIndex());
      }
    });

    return isValid;
  }
}

EmbeddedCreationPortalSectionsView.contextTypes = {
  entityMarkupData: PropTypes.object
};

