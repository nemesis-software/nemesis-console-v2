import React, {Component} from 'react';

import _ from 'lodash';

import SelectCustomArrow from '../../helper-components/select-custom-arrow';
import Select from 'react-select';


import Translate from 'react-translate-component';

import MasterAdminFieldPanel from './master-admin-field-panel';

export default class MasterAdminConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedFields: [...this.props.fieldData]};
    this.fieldPanelReferences = [];
  }

  componentWillMount() {
    this.fieldPanelReferences = [];
  }

  componentWillUpdate() {
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
                    arrowRenderer={() => <SelectCustomArrow/>}
                    clearable={false}
                    placeholder={<Translate component="span" content={'main.addField'} fallback={'Add field'}/>}
                    onChange={this.onAddFieldSelected.bind(this)}
                    options={this.getRemainingFields()}/>
            <hr className="line"/>
          </div>
        </div>
        {this.state.selectedFields.map(field => {
          return <MasterAdminFieldPanel ref={(fieldPanel) => {fieldPanel && this.fieldPanelReferences.push(fieldPanel)}} onDeleteField={this.onDeleteField.bind(this)} key={field.name} field={field} selectedEntityConfigId={this.props.selectedEntityConfigId}/>
        })}
      </div>
    )
  }

  onSaveButtonClick() {
    _.forEach(this.fieldPanelReferences, fieldPanel => {
      fieldPanel.onSaveButtonClick();
    })
  }

  getRemainingFields() {
    return _.map(_.differenceBy(this.props.allFields.items, this.state.selectedFields, 'name'), item => {
      return {value: item, label: item.name}
    });
  }

  onAddFieldSelected(item) {
    let selectedFields = this.state.selectedFields;
    selectedFields.unshift(item.value);
    this.setState({selectedFields: selectedFields});
  }

  onDeleteField(fieldName) {
    let selectedFields = this.state.selectedFields;
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