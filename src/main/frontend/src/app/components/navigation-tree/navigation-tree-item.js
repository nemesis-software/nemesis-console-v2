import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton'
import Translate from 'react-translate-component';

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
                          this.props.children && this.props.children.length > 0 ?
                            <i className="material-icons" style={alignStyle}>{this.state.isChildrenVisible ? 'expand_more' : 'chevron_right'}</i> :
                            false
                        }
                        <Translate component="span"
                                   style={alignStyle}
                                   content={'main.' + this.props.item.text}
                                   fallback={this.props.item.text}/>
                      </div>
                    )}/>

        {
          this.props.children.map((nestedItem, index) =>
            <TreeItem initiallyOpen={this.props.initiallyOpen}
                      isVisible={this.state.isChildrenVisible}
                      key={index} item={nestedItem}
                      nestingLevel={this.props.nestingLevel + 1}
                      children={nestedItem.children || []} />
          )
        }
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

  handleItemClick() {
    this.setState({isChildrenVisible: !this.state.isChildrenVisible});
  }


  getItemStyles(nestingLevel) {
    let additionPadding = this.props.children && (this.props.children.length > 0) ? 0 : 24;
    let paddingLeft = (nestingLevel * 20) + additionPadding;

    return {
      textAlign: 'left',
      width: '100%',
      paddingLeft: paddingLeft + 'px'
    };
  }
}