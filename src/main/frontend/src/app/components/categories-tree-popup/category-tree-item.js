import React, {Component} from 'react';

export default class CategoryTreeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isCollapsed: false};
  }

  render() {
    return (
      <div className="category-tree-item">
        <div style={this.getItemStyle()}>
          {this.getItemIcon()}<div className={'category-tree-item-text' + (this.props.selectedCategory && this.props.selectedCategory.id === this.props.category.id ? ' selected': '')}
                                   onClick={() => this.props.onSelectCategory(this.props.category)}
                                   dangerouslySetInnerHTML={{__html : this.getItemContent()}}/>
        </div>
        {!this.state.isCollapsed ? this.props.category.subcategories.map(this.renderChildren.bind(this)) : false}
      </div>
    )
  }

  getItemIcon() {
    if (!this.props.category.subcategories || this.props.category.subcategories.length === 0) {
      return false;
    }

    if (this.state.isCollapsed) {
      return <i className="material-icons" style={{cursor: 'pointer'}} onClick={() => this.setState({isCollapsed: false})}>keyboard_arrow_right</i>
    } else {
      return <i className="material-icons" style={{cursor: 'pointer'}} onClick={() => this.setState({isCollapsed: true})}>keyboard_arrow_down</i>
    }
  }

  getItemContent() {
    let itemText = this.props.category.code;
    if (!this.props.searchText) {
      return itemText;
    }

    let regex = new RegExp(this.props.searchText, 'gi');
    let indices = [];
    let result;
    while ((result = regex.exec(itemText))) {
      indices.push(result.index);
    }
    if (indices.length > 0) {
      let highlightedText = '';
      let startIndex = 0;
      indices.forEach((index, arrayIndex) => {
        highlightedText += itemText.substring(startIndex, index);
        highlightedText += '<span class="highlight-text">';
        highlightedText += itemText.substring(index, index + this.props.searchText.length);
        highlightedText += '</span>';
        startIndex = index + this.props.searchText.length;
        if (arrayIndex === indices.length - 1) {
          highlightedText += itemText.substring(startIndex);
        }
      });
      return highlightedText;
    }
    return itemText;
  }

  getItemStyle() {
    let marginLeft = 0;
    if (this.props.category.subcategories.length === 0) {
      marginLeft = 24;
    }

    marginLeft += this.props.nestingLevel * 24;
    return {marginLeft: `${marginLeft}px`, height: '24px'}
  }

  renderChildren(category, index) {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        key: index,
        category: category,
        nestingLevel: this.props.nestingLevel + 1,
        children: child,
        onSelectCategory: this.props.onSelectCategory,
        selectedCategory: this.props.selectedCategory,
        searchText: this.props.searchText
      })
    });
  }
}
