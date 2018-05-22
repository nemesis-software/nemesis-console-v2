import React, {Component} from 'react';

import EntityTypeCreationModal from './entity-type-creation-modal';
import EmbeddedCreationPortal from './embedded-creation-portal/embedded-creation-portal';

export default class EmbeddedCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {openModalCreation: true, selectedEntityType: null};
  }

  render() {
    return (
      <React.Fragment>
        {this.state.openModalCreation ?
          <EntityTypeCreationModal onModalCancel={() => this.props.onCreationCancel()} onEntityTypeSelected={this.onEntityTypeSelected.bind(this)}
                                   openModalCreation={this.state.openModalCreation} entityId={this.props.entityId}/> :
          <EmbeddedCreationPortal type={this.props.type} entityId={this.state.selectedEntityType} onCreateEntity={this.props.onCreateEntity} onCreationCancel={this.props.onCreationCancel}/>}
      </React.Fragment>
    )
  }

  onEntityTypeSelected(entityType) {
    this.setState({openModalCreation: false, selectedEntityType: entityType});
  }
}