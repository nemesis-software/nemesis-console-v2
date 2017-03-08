import React, { Component } from 'react';
import { componentRequire } from '../../utils/require-util';
import ApiCall from '../../services/api-call';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import _ from 'lodash';

let TreeItem = componentRequire('app/components/navigation-tree/navigation-tree-item', 'navigation-tree-item1');
let NavigationFilter = componentRequire('app/components/navigation-tree/navigation-filter', 'navigation-filter');

const styles = {
  position: 'fixed',
  width: '300px',
  left: '0',
  top: '68px',
  height: 'calc(100vh - 68px)',
  overflowY: 'auto'
};

export default class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {treeData: [], filteredData: [], openModalCreation: false, creationEntity: null};
    this.selectedCreatingItem = null;
  }

  componentWillMount() {
    ApiCall.get('backend/navigation').then(result => {
      this.setState({...this.state, treeData: result.data, filteredData: result.data});
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Select"
        primary={true}
        onTouchTap={this.handleSelectCreateEntity.bind(this)}
      />,
    ];

    return (
      <div style={styles}>
        <NavigationFilter onFilterChange={this.onFilterChange.bind(this)} data={this.state.treeData} />
        {this.state.filteredData.map((item, index) => <TreeItem onEntityClick={this.props.onEntityClick}
                                                                onCreateEntityClick={this.onCreateEntityClick.bind(this)}
                                                                initiallyOpen={this.state.filteredData.length !== this.state.treeData.length}
                                                                key={index}
                                                                item={item}
                                                                nestingLevel={0}
                                                                nestedItems={item.children || []}>
          <TreeItem/>
        </TreeItem>)}
        <Dialog
          title="Create Entity"
          actions={actions}
          modal={true}
          open={this.state.openModalCreation}
        >
          <RadioButtonGroup name="Choosed Item"
                            valueSelected={this.selectedCreatingItem}
                            onChange={(e, v) => this.selectedCreatingItem = v}
          >
            {this.getEntityCategories(this.state.creationEntity, 0).map((item, index) =>{
              return <RadioButton
                style={this.getRadioButtonStyle(item)}
                key={index}
                value={item.entityId}
                label={item.text}
              />
            })}
          </RadioButtonGroup>

        </Dialog>
      </div>
    )
  };

  onFilterChange(filteredTreeItems) {
    this.setState({...this.state, filteredData: filteredTreeItems});
  }

  getRadioButtonStyle(item) {
    let marginValue = item.nestingLevel * 20;
    return {
      marginLeft: marginValue + 'px'
    }
  }

  handleSelectCreateEntity() {
    this.props.onEntityClick({
      isNew: true,
      entityId: this.state.creationEntity.id,
      entityName: this.selectedCreatingItem
    });
    this.setState({...this.state, openModalCreation: false});
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

  onCreateEntityClick(entity) {
    this.selectedCreatingItem = entity.id;
    this.setState({...this.state, creationEntity: entity, openModalCreation: true})
  }

  handleClose() {
    this.setState({...this.state, openModalCreation: false});
  };

  shouldComponentUpdate(nextProps, nextState) {
   if (_.isEqual(this.state, nextState)) {
     return false;
   }

   return true;
  }
}