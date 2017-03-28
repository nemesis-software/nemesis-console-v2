import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

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
            <Table selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Code</TableHeaderColumn>
                  <TableHeaderColumn>Position</TableHeaderColumn>
                  <TableHeaderColumn>Remove</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover={true}>
                {
                  this.props.value.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableRowColumn>{item.code} <i className="material-icons" style={{cursor: 'pointer'}} onClick={() =>  this.props.onEntityItemClick(item, this.props.entityId, item._links.self.href)}>launch</i></TableRowColumn>
                        <TableRowColumn>{item.position}</TableRowColumn>
                        <TableRowColumn><span style={{color: 'red', cursor: 'pointer'}} onClick={() => this.onDeleteRequest(index)}>Remove</span></TableRowColumn>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </div>
        )
      }
    } else {
      return super.getItemsRender();
    }
  }
}
