import React, {Component} from 'react';

import ApiCall from 'servicesDir/api-call'
import {entityCloneType} from "../../types/entity-types";

export default class NewWidgets extends Component {
  constructor(props) {
    super(props);
    this.state = {data: null, selectedCreatingItem: 'widget'}
  }

  componentDidMount() {
    ApiCall.get(`subtypes/widget`).then(result => {
      this.setState({data: {id: 'widget', text: 'widget', childNodes: result.data}});
    })
  }

  render() {
    return (
      <div style={{background: 'white', padding: '20px'}}>
        {this.state.data ?
          <React.Fragment>
            <div style={{marginBottom: '10px', fontSize: '16px'}}>Please select widget type</div>
            {this.getEntityCategories(this.state.data, 0).map((item, index) => {
              return (
                <div style={this.getRadioButtonStyle(item)} key={index}>
                  <label className="radio-inline" style={{marginBottom: '10px'}}>
                    <input className="nemesis-radio-button default-checked" type="radio" value={item.entityId} defaultChecked={index === 0}
                           onChange={this.handleRadioChange.bind(this)} name={'new-entity'}/>
                    {item.text}
                  </label>
                </div>
              )
            })}
          </React.Fragment> : <div>Loading</div>}
        <button className="nemesis-button success-button" style={{marginRight: '15px'}} onClick={this.handleCreateButtonClick.bind(this)}>Create</button>
      </div>
    );
  }

  handleCreateButtonClick() {
    let slotId = this.props.slotId;
    this.props.onEntityItemClick({entityName: this.state.selectedCreatingItem}, 'widget' , null, entityCloneType, {customClientData: {slots: [{code: slotId, id: slotId}]}});
  };

  getRadioButtonStyle(item) {
    let marginValue = item.nestingLevel * 15;
    return {
      marginLeft: marginValue + 'px'
    }
  }

  handleRadioChange(e) {
    this.setState({selectedCreatingItem: e.target.value});
  }

  getEntityCategories(entity, nestingLevel) {
    let result = [];
    if (!entity) {
      return result;
    }

    result.push({entityId: entity.id, text: entity.text, nestingLevel: nestingLevel});
    if (entity.childNodes && entity.childNodes.length > 0) {
      entity.childNodes.map(node => {
        result = result.concat(this.getEntityCategories(node, nestingLevel + 1))
      })
    }

    return result;
  }
}