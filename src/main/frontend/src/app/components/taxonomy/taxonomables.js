import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ApiCall from "servicesDir/api-call";
import { componentRequire } from '../../utils/require-util';
import _ from "lodash";
import NemesisEntityField from "../field-components/nemesis-entity-field/nemesis-entity-field";
import NemesisTextField from '../field-components/nemesis-text-field/nemesis-text-field';
import DataHelper from "servicesDir/data-helper";
import { array } from "prop-types";
import axios from 'axios';
import NotificationSystem from 'react-notification-system';

let BuildingBlockEntityField = componentRequire('app/components/field-components/nemesis-building-block-entity-field/nemesis-building-block-entity-field', 'nemesis-building-block-entity-field');

const mainTableColumns = [
  {
    dataField: "name",
    text: "Name"
  },
  {
    dataField: "actions",
    text: "Actions",
    style: {
      width: '90px',
      textAlign: 'center'
    }
  }
];

const expandedTableColumns = [
  {
    dataField: "empty",
    text: "",
    style: {
      width: '50px'
    }
  },
  {
    dataField: "name",
    text: "Name"
  },
  {
    dataField: "unit",
    text: "Unit",
    style: {
      width: '200px'
    }
  },
  {
    dataField: "type",
    text: "Type",
    style: {
      width: '200px'
    }
  },
  {
    dataField: "value",
    text: "Value",
    style: {
      width: '200px'
    }
  },
  {
    dataField: "actions",
    text: "Actions",
    style: {
      width: '90px',
      textAlign: 'center'
    }
  }
];

const translationLanguages = {
  languages: [
    { value: "en", labelCode: "English" },
    { value: "bg_BG", labelCode: "Bulgarian" }
  ],
  defaultLanguage: { value: "en", labelCode: "English" }
};

const abstractTaxonamableEntity = 'abstract_taxonomable_entity';

export default class Taxonomables extends Component {
  constructor(props) {
    super(props);
    let defaultLanguage =
      (this.props.defaultLanguage && this.props.defaultLanguage.value) ||
      translationLanguages.defaultLanguage.value;
    this.state = {
      taxonomableTypes: [],
      taxons: [],
      selectedTaxonomableType: {},
      selectedTaxonomable: null,
      expandedAttributes: [],
      selectedTaxon: null,
      isLoading: false,
      selectedLanguage: defaultLanguage,
      selected: [],
      expanded: [],
      markupData: null,
      taxonTypes: []
    };

  }

  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      ApiCall.get("taxon/" + row.id + "/taxonAttributes"
         ,{ projection: "taxonomy" }
      )
        .then(result => {
          this.setState({
            expandedAttributes: result.data,
            selected: [row.id],
            expanded: [row.id]
          });
        });
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id),
        expanded: []
      }));
    }
  }

  render() {
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      clickToExpand: true,
      hideSelectAll: true,
      selected: this.state.selected,
      bgColor: '#EEE',
      onSelect: this.handleOnSelect,
      showExpandColumn: true,
    };

    const expandRow = {
      renderer: row => (
        <BootstrapTable
          ref={n => (this.node = n)}
          keyField="id"
          data={this.renderNestedTableData()}
          columns={expandedTableColumns}
        />
      ),
      expanded: this.state.expanded,
      onExpand: (row, isExpand, rowIndex, e) => {
        this.setState({ expandedAttributes: [] });
        if (isExpand) {
          ApiCall.get("taxon/" + row.id + "/taxonAttributes"
            , { projection: "taxonomy" }
          )
            .then(result => {
              this.setState({
                expandedAttributes: result.data
              });
            });
        }
      },
      className: "text-bold",
      showExpandColumn: false,
      onlyOneExpanding: true
    };

    return (
      <div className="taxon-configuration">
        {this.state.isLoading ? (
          <div className="loading-screen">
            <i className="material-icons loading-icon">cached</i>
          </div>
        ) : (
            false
          )}

        <BuildingBlockEntityField
          onEntitySelect={this.handleNewTaxonomableTypeChange}
          readOnly={this.props.readOnly || !this.state.restrictionField}
          value={'abstract_taxonomable_entity'}
          entityId={'abstract_taxonomable_entity'}
          onValueChange={this.onTaxonomableSelect}
          label={'Taxonomable Type'}
        />

        <NemesisEntityField
          entityId={"taxon"}
          onValueChange={this.onTaxonSelect}
          value={this.state.selectedTaxon}
          label={"Taxon"}
        />

        <button
          className="nemesis-button success-button"
          onClick={this.createNewTaxonAttribute}
          disabled={
            !(this.state.selectedTaxonomable && this.state.selectedTaxon)
          }
        >
          Assign taxon
        </button>
        {this.state.selectedTaxonomable ? (
          <div
            className="entities-table-viewer"
            key={this.state.selectedTaxonomable.id}
          >
            <BootstrapTable
              ref={n => (this.node = n)}
              keyField="id"
              data={this.state.taxons.map(taxon => ({
                id: taxon.id,
                name: this.getTextFieldValue(
                  taxon.name,
                  this.state.selectedLanguage
                ),
                actions: this.deleteButton(taxon.id)
              }))}
              columns={mainTableColumns}
              onlyOneExpanding="true"
              expandRow={expandRow}
              selectRow={selectRow}
            />
          </div>
        ) : (
            false
          )}
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      isLoading: false
    });

    ApiCall.get("markup/entity/all")
      .then(result => {
        this.setState({ taxonTypes: result.data.taxon_attribute.sections[0].items.filter(x => x.name === "type")[0].values });
      });

    ApiCall.get(
      "subtypes/abstract_taxonomable_entity"
    ).then(result => {
      this.setState({ taxonomableTypes: result.data });
    });
  }

  renderNestedTableData = () => {
    const result = DataHelper.mapCollectionData(this.state.expandedAttributes).map(
      attr => ({
        id: attr.id,
        empty: '',
        name: this.getTextFieldValue(
          attr.name,
          this.state.selectedLanguage
        ),
        unit: attr.unit,
        type: attr.type,
        value: this.valueInput(attr.code, attr.id),
        actions: this.saveTaxonUnit(attr.id)
      })
    );
    return result;
  };

  deleteButton = (taxonId) => {
    return (
      <div style={{ margin: '0 auto', textAlign: 'center' }}>
        <i className="delete-icon-container material-icons"
          onClick={() => this.handleDelete(taxonId)}>
          delete_forever
          </i>
      </div>
    );
  };

  handleDelete = (taxonId) => {
    const newTaxonsArray = this.state.taxons.slice(0);
    const deleteTaxonIndex = newTaxonsArray.findIndex(x => x.id === taxonId);
    newTaxonsArray.splice(deleteTaxonIndex, 1);

    const updateTaxonObject = { taxons: newTaxonsArray.map(x => x.id) };
    const { selectedTaxonomableType, selectedTaxonomable } = this.state;

    ApiCall.patch(`${selectedTaxonomableType.value}/${selectedTaxonomable.id}`, updateTaxonObject)
      .then(result => {
        this.setState({
          taxons: newTaxonsArray,
          expanded: [],
          selected: []
        });
      });
  };


  valueInput = (value, unitId) => {
    return (
      <div classes="valueContainer" style={{ margin: '0 auto' }}>
        <NemesisTextField
          currentUnitId={unitId}
          value={value}
          onValueChange={this.onValueFieldChange}
        />
      </div>
    );
  };

  onValueFieldChange = (value, unitId) => {
    const arrayItems = this.state.expandedAttributes._embedded.taxon_attribute.slice(0);
    const itemIndex = arrayItems.findIndex(x => x.id === unitId);
    arrayItems[itemIndex].code = value;

    this.setState(prevState => ({
      expandedAttributes: {
        _embedded: {
          taxon_attribute: arrayItems
        }
      }
    })
    );
  };

  saveTaxonUnit = (unitId) => {
    return (
      <div style={{ margin: '0 auto', textAlign: 'center' }}>
        <i className="save-icon-container material-icons"
          onClick={() => this.saveTaxonReq(unitId)}>
          save
          </i>
      </div>
    );
  };

  saveTaxonReq = (unitId) => {
    const currentUnit = this.state.expandedAttributes._embedded.taxon_attribute.find(x => x.id === unitId);
    const unitObject = {
      taxon_attribute: unitId,
      value: currentUnit.code || ""
    };
    axios
    .get(`https://46.101.177.20:8112/storefront/facade/taxonomy/taxonomyValuesForAttributeCodeAndEntityCodeAndEntityName?taxonAttributeCode=${currentUnit.code}&entityName=${this.state.selectedTaxonomableType.value}&entityCode=${this.state.selectedTaxonomable.code}`)
    .then((result) => console.log(result));
    // ApiCall.patch(`taxonomy_value/`, unitObject)
    //   .then(result => {
    //     console.log("NotificationHere")
    //   });
  };

  openNotificationSnackbar = (message, level) => {
    this.notificationSystem.addNotification({
      message: message,
      level: level || 'success',
      position: 'tc'
    });
  }
  
  getOptions() {
    return this.state.taxonomableTypes.map(taxonomableType => {
      return { value: taxonomableType.id, label: taxonomableType.text };
    });
  };

  handleNewTaxonomableTypeChange = (item) => {
    this.setState({ selectedTaxonomableType: item });
  };

  getTextFieldValue(val = "", language) {
    if (!val) {
      return "";
    };

    return (val[language] && val[language].value) || "";
  };

  onTaxonomableSelect = (value) => {
    console.log(value);
    if (!value) {
      this.setState({ selectedTaxonomable: null });
      return;
    }
    this.setState({ isLoading: true }, () => {
      this.getTaxons(value);
    });
  };

  onTaxonSelect = (value) => {
    if (!value) {
      this.setState((prevState) => ({ ...prevState, selectedTaxon: null }));
      return;
    };
    this.setState((prevState) => ({ ...prevState, selectedTaxon: value }));
  };

  setLoadingStatus(isLoading) {
    this.setState({ isLoading: isLoading });
  };

  getTaxons(selectedTaxonomable) {
    ApiCall.get(
      (this.state.selectedTaxonomableType != null
        ? this.state.selectedTaxonomableType.value
        : "") +
      "/" +
      selectedTaxonomable.id + "/resolvedTaxons")
      .then(result => {
        this.setState((prevState) => ({
          ...prevState,
          taxons: DataHelper.mapCollectionData(result.data),
          selectedTaxonomable: selectedTaxonomable,
          isLoading: false
        }));
      });
  };

  createNewTaxonAttribute = () => {
    const { selectedTaxonomableType, selectedTaxonomable, selectedTaxon } = this.state;

    const updateTaxonObject = { taxons: [...this.state.taxons.map(x => x.id), selectedTaxon.id] };

    ApiCall.patch(`${selectedTaxonomableType.value}/${selectedTaxonomable.id}`, updateTaxonObject)
      .then(result => {
        this.setState({
          taxons: [...this.state.taxons, selectedTaxon]
        });
      });
  };
}