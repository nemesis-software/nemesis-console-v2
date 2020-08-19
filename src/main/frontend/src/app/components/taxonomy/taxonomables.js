import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ApiCall from "servicesDir/api-call";
import { componentRequire } from '../../utils/require-util';
import _ from "lodash";
import NemesisEntityField from "../field-components/nemesis-entity-field/nemesis-entity-field";
import NemesisTextField from '../field-components/nemesis-text-field/nemesis-text-field';
import NemesisNumberField from '../field-components/nemesis-text-field/nemesis-text-field';
import DataHelper from "servicesDir/data-helper";
import NotificationSystem from 'react-notification-system';

let BuildingBlockEntityField = componentRequire('app/components/field-components/nemesis-building-block-entity-field/nemesis-building-block-entity-field', 'nemesis-building-block-entity-field');
let NemesisEntityCollectionField = componentRequire('app/components/field-components/nemesis-collection-field/nemesis-entity-collection-field/nemesis-entity-collection-field', 'nemesis-entity-collection-field');
let NemesisBooleanField = componentRequire('app/components/field-components/nemesis-boolean-field/nemesis-boolean-field', 'nemesis-boolean-field');

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
    this.notificationSystem = null;
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
      taxonTypes: [],
      booleanField: ''
    };
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
          ApiCall.get("taxon/" + row.id + "/taxonAttributes", { projection: "taxonomy" })
            .then(result => {
              let promises = [];
              for (let i = 0; i < result.data._embedded.taxon_attribute.length; i++) {
                promises.push(ApiCall
                  .get(`taxon_attribute/${result.data._embedded.taxon_attribute[i].id}/resolvedTaxonValues?taxonomableEntityName=${this.state.selectedTaxonomableType.value}&taxonomableEntityId=${this.state.selectedTaxonomable.id}`)
                )
              };
              let arrayItems = result.data._embedded.taxon_attribute.slice(0);

              Promise.all(promises)
                .then((result) => {
                  const arrayOfPromisesResults = [];
                  for (let i = 0; i < result.length; i++) {
                    const complexObject = {
                      valueToTake: result[i].data._embedded.taxonomy_value[0].code,
                      valueId: result[i].data._embedded.taxonomy_value[0].id,
                      valueType: result[i].data._embedded.taxonomy_value[0].type,
                      resolvedTaxonValues: result[i].data._embedded.taxonomy_value,
                      ...arrayItems[i]
                    };
                    arrayOfPromisesResults.push(complexObject);
                  };
                  this.setState({
                    expandedAttributes: {
                      _embedded: {
                        taxon_attribute: arrayOfPromisesResults
                      }
                    }
                  });
                })
                .catch(e => {
                  console.log(e);
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
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
    this.setState({
      isLoading: false
    });

    ApiCall.get("markup/entity/all")
      .then(result => {
        this.setState({ taxonTypes: result.data.taxon_attribute.sections[0].items.filter(x => x.name === "type")[0].values });
      });

    ApiCall.get("subtypes/abstract_taxonomable_entity")
    .then(result => {
      this.setState({ taxonomableTypes: result.data });
    });
  }

  renderNestedTableData = () => {
    if (!this.state.expandedAttributes) { return; }
    const result = this.state.expandedAttributes && DataHelper.mapCollectionData(this.state.expandedAttributes).map(
      attr => ({
        id: attr.id,
        empty: '',
        name: this.getTextFieldValue(
          attr.name,
          this.state.selectedLanguage
        ),
        unit: attr.unit,
        type: attr.type,
        value: this.valueInput(attr.type || 'none', attr.predefinedValues, attr.resolvedTaxonValues || [], attr.valueType, attr.valueId, attr.valueToTake, attr.id),
        actions: this.saveTaxonAttrValue(attr.id)
      })
    );
    return result;
  };

  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      ApiCall.get("taxon/" + row.id + "/taxonAttributes", { projection: "taxonomy" })
        .then(result => {
          this.setState({
            expandedAttributes: result.data,
            selected: [row.id],
            expanded: [row.id]
          });
          let promises = [];
          for (let i = 0; i < result.data._embedded.taxon_attribute.length; i++) {
            promises.push(ApiCall
              .get(`taxon_attribute/${result.data._embedded.taxon_attribute[i].id}/resolvedTaxonValues?taxonomableEntityName=${this.state.selectedTaxonomableType.value}&taxonomableEntityId=${this.state.selectedTaxonomable.id}`)
            )
          };
          let arrayItems = result.data._embedded.taxon_attribute.slice(0);

          Promise.all(promises)
            .then((result) => {
              const arrayOfPromisesResults = [];
              for (let i = 0; i < result.length; i++) {
                const complexObject = {
                  valueToTake: result[i].data._embedded.taxonomy_value[0].code,
                  valueId: result[i].data._embedded.taxonomy_value[0].id,
                  valueType: result[i].data._embedded.taxonomy_value[0].type,
                  resolvedTaxonValues: result[i].data._embedded.taxonomy_value,
                  ...arrayItems[i]
                };
                arrayOfPromisesResults.push(complexObject);
              };
              this.setState({
                expandedAttributes: {
                  _embedded: {
                    taxon_attribute: arrayOfPromisesResults
                  }
                }
              });
            })
        });
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id),
        expanded: []
      }));
    }
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

  valueInput = (defaultAttrType, predefinedValues, resolvedTaxonValues, attrType, attrId, attrValue, unitId) => {

    const switchCriteria = (attrType === undefined || attrType === null || !resolvedTaxonValues) ? defaultAttrType : attrType;

    switch (switchCriteria) {
      case "REFERENCE":
        return (
          <div classes="valueContainer" style={{ margin: '0 auto' }}>
            <NemesisEntityCollectionField
              attributes={resolvedTaxonValues.length && resolvedTaxonValues.map(x => x.code)}
              attribitesIds={resolvedTaxonValues.length && resolvedTaxonValues.map(x => x.id)}
              predefinedValues={predefinedValues.slice(1, -1).split(',').map(x => ({ value: x, label: x }))}
              onAttributeDelete={this.onAttributeDelete}
              currentUnitId={unitId}
              showLabel={false}
            />
          </div>
        );

      case "STRING":
        return (
          <div classes="valueContainer" style={{ margin: '0 auto' }}>
            <NemesisTextField
              currentUnitId={unitId}
              value={resolvedTaxonValues.length ? resolvedTaxonValues[0].code : ''}
              onValueChange={this.onValueFieldChange}
              currentUnitId={unitId}
              showLabel={false}
            />
          </div>
        );

      case "NUMBER":
        return (
          <div classes="valueContainer" style={{ margin: '0 auto' }}>
            <NemesisNumberField
              readOnly={this.props.readOnly || !this.state.secondRestrictionField}
              value={attrValue || "true"}
              onValueChange={this.onSelectedMenuItem}
              label={'Count'}
              currentUnitId={unitId}
              showLabel={false}
            />
          </div>
        );

      case "TEXT":
        return (
          <div classes="valueContainer" style={{ margin: '0 auto' }}>
            <NemesisTextField
              currentUnitId={unitId}
              value={resolvedTaxonValues.length ? resolvedTaxonValues[0].code : ''}
              onValueChange={this.onValueFieldChange}
              currentUnitId={unitId}
              showLabel={false}
            />
          </div>
        );
      case "BOOLEAN":
        return (
          <div classes="valueContainer" style={{ margin: '0 auto' }}>
            <NemesisBooleanField
              readOnly={this.props.readOnly}
              value={resolvedTaxonValues.length ? resolvedTaxonValues[0].code : ""}
              onValueChange={this.onBooleanFieldChange}
              label={"boolean"}
              showLabel={false}
              currentUnitId={unitId}
            />
          </div>
        );

      default:
        return (
          <div classes="valueContainer" style={{ margin: '0 auto', color: 'red' }}>
            Please set type for TaxonAttribute
          </div>
        );
    }
  };

  onAttributeDelete = (unitId, code) => {
    const arrayItems = this.state.expandedAttributes._embedded.taxon_attribute.slice(0);
    const itemIndex = arrayItems.findIndex(x => x.id === unitId);
    arrayItems[itemIndex].resolvedTaxonValues = arrayItems[itemIndex].resolvedTaxonValues.filter(x => x.code !== code);

    this.setState({
      expandedAttributes: {
        _embedded: {
          taxon_attribute: arrayItems
        }
      }
    });
  };

  onBooleanFieldChange = (value, unitId) => {
    const arrayItems = this.state.expandedAttributes._embedded.taxon_attribute.slice(0);
    const itemIndex = arrayItems.findIndex(x => x.id === unitId);

    if (arrayItems[itemIndex].resolvedTaxonValues !== undefined) {
      arrayItems[itemIndex].resolvedTaxonValues[0].code = value;
    } else {
      arrayItems[itemIndex].resolvedTaxonValues = [];
      arrayItems[itemIndex].resolvedTaxonValues.push({ 'code': value });
    }

    this.setState({
      expandedAttributes: {
        _embedded: {
          taxon_attribute: arrayItems
        }
      }
    });
  }

  onValueFieldChange = (value, unitId) => {
    const arrayItems = this.state.expandedAttributes._embedded.taxon_attribute.slice(0);
    const itemIndex = arrayItems.findIndex(x => x.id === unitId);

    if (arrayItems[itemIndex].resolvedTaxonValues !== undefined) {
      arrayItems[itemIndex].resolvedTaxonValues[0].code = value;
    } else {
      arrayItems[itemIndex].resolvedTaxonValues = [];
      arrayItems[itemIndex].resolvedTaxonValues.push({ 'code': value });
    }

    this.setState({
      expandedAttributes: {
        _embedded: {
          taxon_attribute: arrayItems
        }
      }
    });
  };

  saveTaxonAttrValue = (unitId) => {
    return (
      <div style={{ margin: '0 auto', textAlign: 'center' }}>
        <i className="save-icon-container material-icons"
          onClick={() => this.saveTaxonAttrValueReq(unitId)}>
          save
          </i>
      </div>
    );
  };

  saveTaxonAttrValueReq = (unitId) => {
    const currentUnit = this.state.expandedAttributes._embedded.taxon_attribute.find(x => x.id === unitId);

    if (currentUnit.resolvedTaxonValues && currentUnit.resolvedTaxonValues[0].type === "REFERENCE") {
      let updateTaxonObject = currentUnit.resolvedTaxonValues.map(x => x.id);
      ApiCall.patch(`${this.state.selectedTaxonomableType.value}/${this.state.selectedTaxonomable.id}`, { taxonomyValues: updateTaxonObject })
        .then(result => {
          this.openNotificationSnackbar('Taxon Attribute Updated!');
        });
    } else if (!currentUnit.resolvedTaxonValues.id) {
      const attrValueObject = {
        value: currentUnit.resolvedTaxonValues[0].code,
        taxon_attribute: unitId
      };
      ApiCall.post(`taxonomy_value`, attrValueObject)
        .then(result => {
          const attrValueArrayObject = { taxonomyValues: [result.data.id] };
          ApiCall.patch(`${this.state.selectedTaxonomableType.value}/${this.state.selectedTaxonomable.id}`, attrValueArrayObject)
            .then(result => {
              this.openNotificationSnackbar('Taxon Attribute Updated!');
            });
        });
    } else {
      const attrValueObject = {
        value: currentUnit.resolvedTaxonValues[0].code
      };
      ApiCall.patch(`taxonomy_value/${currentUnit.resolvedTaxonValues[0].id}`, attrValueObject)
        .then(result => {
          this.openNotificationSnackbar('Taxon Attribute Updated!');
        });
    }
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
    if (!value) {
      this.setState({ selectedTaxonomable: null });
      return;
    }
    this.setState({
      isLoading: true,
      expanded: [],
      selected: []
    }, () => {
      this.getTaxons(value);
    });
  };

  onTaxonSelect = (value) => {
    if (!value) {
      this.setState({ selectedTaxon: null });
      return;
    };
    this.setState({ selectedTaxon: value });
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
      selectedTaxonomable.id + "/resolvedTaxons", { projection: 'search' })
      .then(result => {
        this.setState((prevState) => ({
          ...prevState,
          taxons: result.data ? DataHelper.mapCollectionData(result.data) : [],
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