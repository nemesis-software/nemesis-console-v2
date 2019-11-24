import React, {Component} from 'react';
import ApiCall from 'servicesDir/api-call';
import _ from 'lodash';
import counterpart from 'counterpart';
import NemesisEntityField from '../field-components/nemesis-entity-field/nemesis-entity-field';
import EntitiesPager from '../entity-window/entities-viewer/entities-pager/entities-pager';
import TaxonAttributeRow from './taxon-attribute-row'
import DataHelper from 'servicesDir/data-helper';

export default class Taxonomables extends Component {
  constructor(props) {
    super(props);
    this.state = {taxonAttributes: [], selectedTaxonomable: null, isLoading: true};
  }

  componentWillMount() {
     this.setState({isLoading: false});
  }

  render() {
    return (
      <div className="taxon-configuration">
        {this.state.isLoading ? <div className="loading-screen">
          <i className="material-icons loading-icon">cached</i>
        </div> : false}
        <NemesisEntityField entityId={'partner'} onValueChange={this.onTaxonomableSelect.bind(this)} value={this.state.selectedTaxonomable}
        label={'Taxonomable'}/>
        <button className="nemesis-button success-button" onClick={() => this.createNewTaxonAttribute()}>Add new attribute</button>
        {this.state.selectedTaxonomable ? <div className="entities-table-viewer" key={this.state.selectedTaxonomable.id}>
          <table>
            <thead>
            <tr>
              <th>Taxon Attributes</th>
              <th>Name</th>
              <th>Unit</th>
              <th>TYPE</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {this.state.taxonAttributes.map(taxonAttribute => <TaxonAttributeRow openNotificationSnackbar={this.props.openNotificationSnackbar}
                                                                             setLoadingStatus={this.setLoadingStatus.bind(this)}
                                                                             key={taxonAttribute.code}
                                                                             taxonAttribute={taxonAttribute}/>)}
            </tbody>
          </table>
        </div> : false}
      </div>
    );
  }

  onTaxonomableSelect(value) {
    if (!value) {
      this.setState({selectedTaxonomable: null});
      return;
    }
    this.setState({isLoading: true}, () => {
      this.getTaxonAttributes(value);
    });
  }

  setLoadingStatus(isLoading) {
    this.setState({isLoading: isLoading});
  }


getTaxonAttributes(selectedTaxonomable) {
  ApiCall.get('taxon/' + selectedTaxonomable.id + "/taxonAttributes", {projection: 'search'})
  .then
  (result => {
      console.log(result);
    this.setState({...this.state, taxonAttributes: DataHelper.mapCollectionData(result.data), selectedTaxonomable: selectedTaxonomable, isLoading: false});
  })
}

createNewTaxonAttribute() {

}
}
