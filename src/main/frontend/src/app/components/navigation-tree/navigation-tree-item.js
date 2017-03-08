import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton'
import Translate from 'react-translate-component';
import FontIcon from 'material-ui/FontIcon';

const alignStyle = {
  verticalAlign: 'middle'
};

export default class TreeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isChildrenVisible: !!this.props.initiallyOpen};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({isChildrenVisible: nextProps.initiallyOpen})
  }

  render() {
    return (
      <div style={this.getContainerStyles(this.props.nestingLevel)}>
        <FlatButton onClick={this.handleItemClick.bind(this)}
                    style={this.getItemStyles(this.props.nestingLevel)}
                    children={(
                      <div>
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
                      </div>
                    )}/>
        {this.props.nestedItems.map(this.renderChildren.bind(this))}
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
        onCreateEntityClick: this.props.onCreateEntityClick,
        children: child
      })
    });
  }

  handleItemClick(event) {
    let entity = this.props.item;
    if (event.target.className.indexOf('add-icon') > -1) {

      if (!entity.childNodes || entity.childNodes.length === 0) {
        this.props.onEntityClick({
          isNew: true,
          entityId: entity.id,
          entityName: entity.id
        });
      } else {
        this.props.onCreateEntityClick(entity);
      }

      return;
    }

    if (this.props.onEntityClick && entity.leaf) {
      this.props.onEntityClick({entityId: entity.id});
    }
    this.setState({isChildrenVisible: !this.state.isChildrenVisible});
  }


  getItemStyles(nestingLevel) {
    let additionPadding = this.props.nestedItems && (this.props.nestedItems.length > 0) ? 0 : 24;
    let paddingLeft = (nestingLevel * 20) + additionPadding;

    return {
      textAlign: 'left',
      width: '100%',
      paddingLeft: paddingLeft + 'px'
    };
  }
}