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
        <div>
          <button className="nemesis-button success-button" onClick={this.onSaveButtonClick.bind(this)}>Save</button>
          <div className="add-field-container">
            <Translate component="label" content={'main.addField'} fallback={'Add field'}/>
            <Select cache={false}
                    style={{width: '265px'}}
                    arrowRenderer={() => <SelectCustomArrow/>}
                    clearable={false}
                    onChange={this.onAddFieldSelected.bind(this)}
                    options={this.getRemainingFields()}/>
            <hr className="line"/>
          </div>
        </div>
        {this.state.selectedFields.map(field => {
          return <MasterAdminFieldPanel ref={(fieldPanel) => {fieldPanel && this.fieldPanelReferences.push(fieldPanel)}} key={field.name} field={field} selectedEntityConfigId={this.props.selectedEntityConfigId}/>
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
    selectedFields.push(item.value);
    this.setState({selectedFields: selectedFields});
  }
}