import React from 'react';

import NemesisEntityCollectionField from '../app/components/field-components/nemesis-collection-field/nemesis-entity-collection-field/nemesis-entity-collection-field';

export default class CustomEntityCollectionField extends NemesisEntityCollectionField {
  constructor(props) {
    super(props);
  }

  getItemsRender() {
    //Override visualization for cms_slot to be table instead of default chip view
    if (this.props.entityId === 'cms_slot') {
      if (!this.state.value || this.state.value.length === 0) {
        return <div>No Records</div>
      } else {
        return (
          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Position</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.value.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.code} <i className="material-icons" style={{cursor: 'pointer'}} onClick={() =>  this.props.onEntityItemClick(item, this.props.entityId, item._links.self.href)}>launch</i></td>
                        <td>{item.position}</td>
                        <td><span style={{color: 'red', cursor: 'pointer'}} onClick={() => this.onDeleteRequest(index)}>Remove</span></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        )
      }
    } else {
      return super.getItemsRender();
    }
  }
}
