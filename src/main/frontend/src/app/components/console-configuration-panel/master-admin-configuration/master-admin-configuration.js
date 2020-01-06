import React, {Component} from 'react';

import _ from 'lodash';

import SelectCustomArrow from '../../helper-components/select-custom-arrow';
import Select from 'react-select';


import Translate from 'react-translate-component';

import MasterAdminFieldPanel from './master-admin-field-panel';

export default class MasterAdminConfiguration extends Component {
  constructor(props) {
    super(props);
    let selectedFields = [...this.props.fieldData];
    this.state = {selectedFields: selectedFields, sections: _.uniq(selectedFields.map(item => item.section))};
    this.fieldPanelReferences = [];
  }

  componentDidMount() {
    this.fieldPanelReferences = [];
  }

  UNSAFE_componentWillUpdate() {
    this.fieldPanelReferences = [];
  }

  render() {
    return (
      <div className="master-admin-configuration">
        <div className="master-admin-configuration-header">
          <div className="back-button" title="back" onClick={this.props.handleBackButton}><i className="material-icons">arrow_back</i></div>
          <button className="nemesis-button success-button save-button" onClick={this.onSaveButtonClick.bind(this)}>Save</button>
          <div className="add-field-container">
            <Select cache={false}
                    style={{width: '265px'}}
                    className="entity-field-select entity-field"
                    arrowRenderer={() => <SelectCustomArrow/>}
                    clearable={false}
                    placeholder={<Translate component="span" content={'main.addField'} fallback={'Add field'}/>}
                    onChange={this.onAddFieldSelected.bind(this)}
                    options={this.getRemainingFields()}/>
            <hr className="line"/>
          </div>
        </div>
        <Translate component="div" content={'main.' + this.props.entityName} fallback={this.props.entityName} className="entity-name-container"/>
        {this.state.selectedFields.map(field => {
          return <MasterAdminFieldPanel ref={(fieldPanel) => {fieldPanel && this.fieldPanelReferences.push(fieldPanel)}}
                                        onDeleteField={this.onDeleteField.bind(this)}
                                        key={field.name}
                                        entityName={this.props.entityName}
                                        field={field}
                                        sections={this.state.sections}
                                        openNotificationSnackbar={this.props.openNotificationSnackbar}/>
        })}
      </div>
    )
  }

  onSaveButtonClick() {
    Promise.all(this.fieldPanelReferences.map(fieldPanel => {
      return fieldPanel.onSaveButtonClick();
    })).then(result => {
      let selectedFields = [...this.state.selectedFields];
      result.forEach(item => {
        if (item) {
          let fieldIndex = _.findIndex(selectedFields, {name: item.name});
          if (fieldIndex !== -1) {
            selectedFields[fieldIndex] = item;
          }
        }
      });
      this.setState({selectedFields: selectedFields});
    })
  }

  getRemainingFields() {
    return _.map(_.differenceBy(this.props.allFields.items, this.state.selectedFields, 'name'), item => {
      return {value: item, label: item.name}
    });
  }

  onAddFieldSelected(item) {
    let selectedFields = [...this.state.selectedFields];
    selectedFields.unshift(item.value);
    this.setState({selectedFields: selectedFields});
  }

  onDeleteField(fieldName) {
    let selectedFields = [...this.state.selectedFields];
    let fieldIndex = _.findIndex(selectedFields, {name: fieldName});
    if (fieldIndex === -1) {
      return;
    }
    selectedFields.splice(fieldIndex, 1);
    this.setState({selectedFields: selectedFields}, () => {
      this.props.openNotificationSnackbar(`${fieldName} successfully removed`)
    });
  }
}