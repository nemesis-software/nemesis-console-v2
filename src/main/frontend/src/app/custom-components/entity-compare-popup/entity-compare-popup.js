import React, {Component} from 'react';

import {Modal} from 'react-bootstrap';

import DataService from 'servicesDir/data-service';
import PropTypes from "prop-types";
import EntityFieldComparator from "./entity-field-comparator";

export default class EntityComparePopup extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      entityFields: this.getFlattedEntityFields(context.entityMarkupData[this.props.entityName]),
      firstEntityData: {},
      secondEntityData: {},
      isDataLoading: true,
      showDiffOnly: false
    }
  }

  UNSAFE_componentWillMount() {
    let entityName = this.props.entityName;
    let firstItemUrl = entityName + '/' + this.props.firstItemId;
    let secondItemUrl = entityName + '/' + this.props.secondItemId;
    let relatedEntities = _.filter(this.state.entityFields, field => !!field.entityId).map(field => {
      return {type: field.xtype, name: field.name.replace('entity-', '')};
    });
    Promise.all([DataService.getEntityData(firstItemUrl, relatedEntities), DataService.getEntityData(secondItemUrl, relatedEntities)]).then(result => {
      this.setState({firstEntityData: result[0], secondEntityData: result[1], isDataLoading: false});
    })
  }

  render() {
    return (
      <Modal className={'entity-compare-popup' + (this.state.showDiffOnly ? ' diff-only' : '')} show={this.props.openModal} onHide={this.handleModalClose.bind(this)} animation={false} size="large">
        <Modal.Header>
          <Modal.Title>
            Entity compare
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{paddingLeft: '20px', marginBottom: '10px'}}>
            <label className="checkbox-inline">
              <input type="checkbox" className={"nemesis-checkbox" + (this.state.showDiffOnly ? ' active' : '')}
                     onChange={() => this.setState({showDiffOnly: !this.state.showDiffOnly})}/>
              Show different only
            </label>

          </div>
          <div className="display-table" style={{width: '100%'}}>
            <div className="display-table-cell" style={{textAlign: 'center', width: '50%'}}><label>Staged</label></div>
            <div className="display-table-cell" style={{textAlign: 'center', width: '50%'}}><label>Online</label></div>
          </div>
          {this.state.isDataLoading ? false : this.state.entityFields.map((field, index) => {
            return <EntityFieldComparator key={index}
                                          field={field}
                                          firstData={this.getItemData(field, this.state.firstEntityData)}
                                          secondData={this.getItemData(field, this.state.secondEntityData)}/>
          })}
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    )
  }

  getItemData(item, data) {
    if (item.entityId) {
      return data.customClientData && data.customClientData[item.name];
    }

    return data[item.name];
  }

  handleModalClose() {
    this.props.onModalClose();
  }

  getFlattedEntityFields(markupData) {
    let result = [];
    markupData.sections.forEach(section => {
      result = result.concat(section.items);
    });
    return result;
  }
}

EntityComparePopup.contextTypes = {
  entityMarkupData: PropTypes.object
};

