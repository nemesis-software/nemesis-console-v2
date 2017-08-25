import React, {Component} from 'react';

import Modal from 'react-bootstrap/lib/Modal';

import _ from 'lodash';

import NemesisMapFieldItem from './nemesis-map-field-item';

const keyPrefix = 'mapField';

export default class NemesisMapFieldPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {fields: this.buildFields(this.props.fields)};

    this.mapFieldsReference = [];
  }

  render() {
    return (
      <Modal show={this.props.openPopup}>
        <Modal.Header>
          <Modal.Title>Edit map field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button className="btn btn-default" onClick={this.addNewField.bind(this)}>Add new field</button>
          {this.state.fields.map(item => {
            return <NemesisMapFieldItem ref={(el) => { el && this.mapFieldsReference.push(el)}}
                                        key={item.id}
                                        item={item}
                                        removeField={this.removeField.bind(this)} />
          })}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.handleCloseModal.bind(this, false)}>Cancel</button>
          <button className="btn btn-default" onClick={this.handleCloseModal.bind(this, true)}>Done</button>
        </Modal.Footer>
      </Modal>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openPopup) {
      this.setState({...this.state, fields: this.buildFields(nextProps.fields)})
    }
  }

  componentWillUpdate() {
    this.mapFieldsReference = [];
  }

  buildFields(mapObject) {
    let counter = 0;
    let result = [];
    _.forIn(mapObject, (value, key) => {
      result.push({id: `${keyPrefix}${counter}`, value: value, key: key});
      counter++;
    });

    return result;
  }


  handleCloseModal(shouldUpdateValue) {
    if (!shouldUpdateValue) {
      this.props.onMapPopupClose(false);
      return;
    }

    let fields = this.getFieldFromPopup();
    if (this.validateFields(fields)) {
      let actualFields = {};
      fields.forEach(item => {
        actualFields[item.key] = item.value;
      });

      if (_.isEqual(actualFields, this.props.fields)) {
        this.props.onMapPopupClose(false);
      } else {
        this.props.onMapPopupClose(true, actualFields);
      }
    }
  }

  addNewField() {
    let result = this.state.fields;
    result.push({id: `${keyPrefix}${Date.now()}`, value: '', key: ''});
    this.setState({...this.state, fields: result})
  }

  removeField(itemId) {
    let fields = this.state.fields;
    let removeItemIndex = _.findIndex(fields, item => item.id === itemId);
    if (removeItemIndex < 0) {
      return;
    }
    fields.splice(removeItemIndex, 1);

    this.setState({...this.state, fields: fields});
  }

  getFieldFromPopup() {
    let result = [];
    this.mapFieldsReference.forEach(field => {
      let fieldValue = field.getFieldValue();
      result.push(fieldValue);
    });
    return result;
  }

  validateFields(fields) {
    let isFieldsValid = true;
    for (let i = 0; i < fields.length; i++) {
      if (_.isEmpty(fields[i].key)) {
       isFieldsValid = false;
       fields[i].errorMessage = 'Key cannot be empty';
       continue;
      }

      for (let j = 0; j < fields.length; j++) {
        if (j === i) {
          continue;
        }

        if (fields[i].key === fields[j].key) {
          fields[i].errorMessage = 'Key cannot be duplicate';
          isFieldsValid = false;
          break;
        }
      }
    }
    this.setState({...this.state, fields: fields});
    return isFieldsValid;
  }
}
