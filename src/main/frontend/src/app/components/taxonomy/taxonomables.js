import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ApiCall from "servicesDir/api-call";
import _ from "lodash";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import Select from "react-select";
import NemesisEntityField from "../field-components/nemesis-entity-field/nemesis-entity-field";
import EntitiesPager from "../entity-window/entities-viewer/entities-pager/entities-pager";
import TaxonAttributeRow from "./taxon-attribute-row";
import DataHelper from "servicesDir/data-helper";

const columns = [
  {
    dataField: "name",
    text: "Name"
  },
  {
    dataField: "unit",
    text: "Unit"
  },
  {
    dataField: "type",
    text: "Type"
  },
  {
    dataField: "value",
    text: "Value"
  }
];

const translationLanguages = {
  languages: [
    { value: "en", labelCode: "English" },
    { value: "bg_BG", labelCode: "Bulgarian" }
  ],
  defaultLanguage: { value: "en", labelCode: "English" }
};

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
      isLoading: true,
      selectedLanguage: defaultLanguage
    };
  }

  componentWillMount() {
    this.setState({ isLoading: false });
  }

  render() {
    const expandRow = {
      renderer: row => (
        <BootstrapTable
          ref={n => (this.node = n)}
          keyField="id"
          data={this.state.expandedAttributes}
          columns={columns}
        />
      ),
      onExpand: (row, isExpand, rowIndex, e) => {
        //this.setState({...this.state, expandedAttributes: []});
        if (isExpand) {
          ApiCall.get("taxon/" + row.id + "/taxonAttributes", {
            projection: "search"
          }).then(result => {
            this.setState({
              ...this.state,
              expandedAttributes: DataHelper.mapCollectionData(result.data).map(
                attr => ({
                  id: attr.id,
                  name: this.getTextFieldValue(
                    attr.name,
                    this.state.selectedLanguage
                  ),
                  unit:
                    attr.unit != null
                      ? this.getTextFieldValue(
                          attr.unit.name,
                          this.state.selectedLanguage
                        )
                      : "",
                  type: attr.type,
                  value: attr.code
                })
              )
            });
            console.log(result);
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
        <div className="entity-field-container">
          <div className="entity-field-input-container">
            <div>
              <Translate
                component="label"
                content={"main.taxonomableType"}
                fallback="taxonomableType"
              />
            </div>
            <Select
              disabled={this.props.readOnly}
              className="entity-field"
              value={{
                value:
                  this.state.selectedTaxonomableType != null
                    ? this.state.selectedTaxonomableType.value
                    : "",
                label:
                  this.state.selectedTaxonomableType != null
                    ? this.state.selectedTaxonomableType.label
                    : ""
              }}
              onChange={item => this.handleNewTaxonomableTypeChange(item)}
              options={this.getOptions()}
            />
          </div>
        </div>
        <NemesisEntityField
          entityId={
            this.state.selectedTaxonomableType != null
              ? this.state.selectedTaxonomableType.value
              : ""
          }
          onValueChange={this.onTaxonomableSelect.bind(this)}
          value={this.state.selectedTaxonomable}
          label={"Taxonomable"}
        />
        <NemesisEntityField
          entityId={"taxon"}
          onValueChange={this.onTaxonSelect.bind(this)}
          value={this.state.selectedTaxon}
          label={"Taxon"}
        />
        <button
          className="nemesis-button success-button"
          onClick={() => this.createNewTaxonAttribute()}
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
                unit:
                  taxon.unit != null
                    ? this.getTextFieldValue(
                        taxon.unit.name,
                        this.state.selectedLanguage
                      )
                    : "",
                type: taxon.type,
                value: ""
              }))}
              columns={columns}
              onlyOneExpanding="true"
              expandRow={expandRow}
            />
          </div>
        ) : (
          false
        )}
      </div>
    );
  }

  componentDidMount() {
    ApiCall.get(
      "subtypes/building-block/com.nemesis.platform.module.taxonomy.core.definition.AbstractTaxonomableEntityDefinition"
    ).then(result => {
      this.setState({ ...this.state, taxonomableTypes: result.data });
    });
  }

  getOptions() {
    return this.state.taxonomableTypes.map(taxonomableType => {
      return { value: taxonomableType.id, label: taxonomableType.text };
    });
  }

  handleNewTaxonomableTypeChange(item) {
    let level = item && item.value;
    this.setState({ ...this.state, selectedTaxonomableType: item });
  }

  getTextFieldValue(val, language) {
    if (!val) {
      return "";
    }

    return (val[language] && val[language].value) || "";
  }

  onTaxonomableSelect(value) {
    if (!value) {
      this.setState({ selectedTaxonomable: null });
      return;
    }
    this.setState({ isLoading: true }, () => {
      this.getTaxons(value);
    });
  }

  onTaxonSelect(value) {
    if (!value) {
      this.setState({ ...this.state, selectedTaxon: null });
      return;
    }
    this.setState({ ...this.state, selectedTaxon: value });
  }

  setLoadingStatus(isLoading) {
    this.setState({ isLoading: isLoading });
  }

  getTaxons(selectedTaxonomable) {
    ApiCall.get(
      (this.state.selectedTaxonomableType != null
        ? this.state.selectedTaxonomableType.value
        : "") +
        "/" +
        selectedTaxonomable.id +
        "/resolvedTaxons",
      { projection: "search" }
    ).then(result => {
      this.setState({
        ...this.state,
        taxons: DataHelper.mapCollectionData(result.data),
        selectedTaxonomable: selectedTaxonomable,
        isLoading: false
      });
    });
  }

  createNewTaxonAttribute() {}
}
