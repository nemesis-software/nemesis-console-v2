import React, { Component } from 'react';
import Translate from 'react-translate-component';
import TouchRipple from 'material-ui/internal/TouchRipple';
import Modal from 'react-bootstrap/lib/Modal';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const alignStyle = {
  verticalAlign: 'middle'
};

export default class TreeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isChildrenVisible: !!this.props.initiallyOpen, openModalCreation: false, creationEntity: null};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...this.state, isChildrenVisible: nextProps.initiallyOpen})
  }

  render() {
    return (
      <div style={this.getContainerStyles(this.props.nestingLevel)}>
        <div onClick={this.handleItemClick.bind(this)} style={this.getItemStyles(this.props.nestingLevel)}>
          <TouchRipple>
            {
              this.props.nestedItems && this.props.nestedItems.length > 0 ?
                <i className="material-icons" style={alignStyle}>{this.state.isChildrenVisible ? this.getOpenedItemIcon() : this.getClosedItemIcon()}</i> :
                false
            }
            <Translate component="span"
                       style={alignStyle}
                       content={'main.' + this.props.item.text}
                       fallback={this.props.item.text}/>
            { !this.props.nestedItems || this.props.nestedItems.length === 0 ? <i style={{verticalAlign: 'middle', marginLeft: '15px'}} className="material-icons add-icon">add</i> : false}
          </TouchRipple>
        </div>
        {this.props.nestedItems.map(this.renderChildren.bind(this))}
        {this.state.openModalCreation ?
          <Modal show={this.state.openModalCreation} onHide={this.handleClose.bind(this)}>
            <Modal.Header>
              <Modal.Title>Create Entity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Please select entity type</div>
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
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-info" onClick={this.handleClose.bind(this)}>Cancel</button>
              <button className="btn btn-primary" onClick={this.handleSelectCreateEntity.bind(this)}>Create</button>
            </Modal.Footer>
          </Modal> : false}
      </div>
    )
  };

  getContainerStyles(nestingLevel) {
    let styles = { };

    if (nestingLevel > 0 && !this.props.isVisible) {
      styles.display = 'none';
    }

    return styles;
  }

  getClosedItemIcon() {
    return 'chevron_right';
  }

  getOpenedItemIcon() {
    return 'expand_more';
  }

  renderChildren(nestedItem, index) {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        initiallyOpen: this.props.initiallyOpen,
        isVisible: this.state.isChildrenVisible,
        key: index,
        item: nestedItem,
        nestingLevel: this.props.nestingLevel + 1,
        nestedItems: nestedItem.children || [],
        onEntityClick: this.props.onEntityClick,
        children: child
      })
    });
  }

  handleItemClick(event) {
    let entity = this.props.item;
    if (event.target.className.indexOf('add-icon') > -1) {
      this.onCreateEntityClick(entity);
      return;
    }

    if (this.props.onEntityClick && entity.leaf) {
      this.props.onEntityClick({entityId: entity.id});
    }
    this.setState({...this.state, isChildrenVisible: !this.state.isChildrenVisible});
  }


  getItemStyles(nestingLevel) {
    let additionPadding = this.props.nestedItems && (this.props.nestedItems.length > 0) ? 0 : 24;
    let paddingLeft = (nestingLevel * 20) + additionPadding;

    return {
      position: 'relative',
      textAlign: 'left',
      width: '100%',
      padding: '5px 0',
      fontSize: '17px',
      paddingLeft: paddingLeft + 'px',
      cursor: 'pointer'
    };
  }

  handleSelectCreateEntity() {
    this.props.onEntityClick({
      isNew: true,
      entityId: this.state.creationEntity.id,
      entityName: this.selectedCreatingItem
    });
    this.setState({...this.state, openModalCreation: false});
  }

  onCreateEntityClick(entity) {
    this.selectedCreatingItem = entity.id;
    this.setState({...this.state, creationEntity: entity, openModalCreation: true})
  }

  handleClose() {
    this.setState({...this.state, openModalCreation: false});
  };

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

  getRadioButtonStyle(item) {
    let marginValue = item.nestingLevel * 15;
    return {
      marginLeft: marginValue + 'px'
    }
  }
}