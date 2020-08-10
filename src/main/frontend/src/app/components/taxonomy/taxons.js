import React, { Component } from "react";
import ApiCall from "servicesDir/api-call";
import { Button } from "react-bootstrap";
import _ from "lodash";
import { componentRequire } from "../../utils/require-util";
import ConsolePopup from "../../custom-components/backend-console-popup";
import NemesisEntityField from "../field-components/nemesis-entity-field/nemesis-entity-field";
import DataHelper from "servicesDir/data-helper";
import NotificationSystem from "react-notification-system";
import BootstrapTable from "react-bootstrap-table-next";
import NemesisEnumField from '../field-components/nemesis-enum-field/nemesis-enum-field';
let NemesisLocalizedTextField = componentRequire('app/components/field-components/nemesis-localized-text-field/nemesis-localized-text-field', 'nemesis-localized-text-field');

let NemesisHeader = componentRequire(
  "app/components/nemesis-header/nemesis-header",
  "nemesis-header"
);

const taxonAttrTableColumns = [
  {
    dataField: "code",
    text: "Taxon Attribute"
  },
  {
    dataField: "name",
    text: "Name",
    style: {
      width: '580px'
    }
  },
  {
    dataField: "unit",
    text: "Unit",
    style: {
      width: '100px'
    }
  },
  {
    dataField: "type",
    text: "Type",
    style: {
      width: '100px'
    }
  },
  {
    dataField: "actions",
    text: "Actions",
    style: {
      width: '120px',
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

export default class Taxons extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = null;
    const defaultLanguage = (this.props.defaultLanguage && this.props.defaultLanguage.value)
      || translationLanguages.defaultLanguage.value;
    this.state = {
      expandedAttributes: [],
      taxonTypes: [],
      selectedLanguage: defaultLanguage,
      taxonAttributes: [],
      selectedTaxon: null,
      selectedTaxonAttribute: null,
      openBackendConsolePopup: false,
      isLoading: false
    };

  }

  render() {
    return (
      <div className="taxon-configuration">
        {this.state.isLoading ? (
          <div className="loading-screen">
            <i className="material-icons loading-icon">cached</i>
          </div>
        ) : (
            false
          )}
        <NemesisEntityField
          entityId={"taxon"}
          onValueChange={this.onTaxonSelect.bind(this)}
          value={this.state.selectedTaxon}
          label={"Taxon"}
        />
        <NemesisEntityField
          entityId={"taxon_attribute"}
          onValueChange={this.onTaxonAttributeSelect.bind(this)}
          value={this.state.selectedTaxonAttribute}
          label={"Attribute"}
        />
        <button
          className="nemesis-button success-button"
          onClick={() => this.assignNewTaxonAttribute()}
          disabled={
            !(this.state.selectedTaxon && this.state.selectedTaxonAttribute)
          }
        >
          Assign attribute
        </button>
        <button
          className="nemesis-button success-button pl-2"
          onClick={() => this.createNewTaxonAttribute()}
        >
          Create new attribute
        </button>
        {this.state.openBackendConsolePopup ? (
          <ConsolePopup
            open={this.state.openBackendConsolePopup}
            itemId={this.state.editTaxonAttribute}
            entityId="taxon_attribute"
            entityName="taxon_attribute"
            onClose={() =>
              this.setState((prevState) => ({ ...prevState, openBackendConsolePopup: false }))
            }
          />
        ) : (
            false
          )}
        {this.state.selectedTaxon &&
          <div
            className="taxon-attribute-table-viewer"
            key={this.state.selectedTaxon.id}
          >
            <BootstrapTable
              ref={n => (this.node = n)}
              keyField="id"
              data={this.renderNestedTableData()}
              columns={taxonAttrTableColumns}
            />
          </div>
        }
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
    this.setState((prevState) => ({ ...prevState, isLoading: false }));

    ApiCall.get("markup/entity/all")
      .then(result => {
        this.setState({ taxonTypes: result.data.taxon_attribute.sections[0].items.filter(x => x.name === "type")[0].values });
      });
  }

  renderNestedTableData = () => {
    const result = DataHelper.mapCollectionData(this.state.expandedAttributes).map(
      attr => ({
        id: attr.id,
        empty: '',
        code: attr.code,
        name: this.localizedName(attr.name),
        unit: this.unitInput(attr.id),
        type: this.typeInput(attr.type, attr.id),
        actions: this.saveDeleteTaxonAttr(attr.id)
      })
    );
    return result;
  };

  localizedName = (taxonName) => {
    return <NemesisLocalizedTextField
      readOnly={false}
      value={taxonName}
      label={"Name"}
      showLabel={false}
    />;
  }

  getTextFieldValue(val = "", language) {
    if (!val) {
      return "";
    };

    return (val[language] && val[language].value) || "";
  };

  onTaxonSelect(value) {
    if (!value) {
      this.setState({ selectedTaxon: null });
      return;
    }
    this.setState({ isLoading: true }, () => {
      this.getTaxonAttributes(value);
    });
  }

  onTaxonAttributeSelect(value) {
    if (!value) {
      this.setState({ selectedTaxonAttribute: null });
      return;
    }
    this.setState({ ...this.state, selectedTaxonAttribute: value });
  }

  setLoadingStatus(isLoading) {
    this.setState({ isLoading: isLoading });
  }

  getTaxonAttributes(selectedTaxon) {
    ApiCall.get("taxon/" + selectedTaxon.id + "/taxonAttributes", { projection: "taxonomy" })
      .then(result => {
        this.setState({
          ...this.state,
          expandedAttributes: result.data,
          taxonAttributes: DataHelper.mapCollectionData(result.data),
          selectedTaxon: selectedTaxon,
          isLoading: false
        });
      });
  }

  assignNewTaxonAttribute() {
    var self = this;
    var taxonAttributeIds = [];

    this.state.expandedAttributes._embedded.taxon_attribute.forEach(el => taxonAttributeIds.push(el.id));
    taxonAttributeIds.push(this.state.selectedTaxonAttribute.id);

    ApiCall.patch("taxon/" + this.state.selectedTaxon.id + "/", {
      taxonAttributes: taxonAttributeIds
    }).then(
      () => {
        self.openNotificationSnackbar("Saved successfully!");
        this.getTaxonAttributes(this.state.selectedTaxon);
      },
      err => {
        self.openNotificationSnackbar("Save failed!", "error");
      }
    );
  }

  createNewTaxonAttribute() {
    this.setState({ ...this.state, openBackendConsolePopup: true });
  }

  openNotificationSnackbar(message, level) {
    this.notificationSystem.addNotification({
      message: message,
      level: level || "success",
      position: "tc"
    });
  }

  unitInput = (taxonId) => {
    ApiCall.get(`taxon_attribute/${taxonId}/unit`)
      .then(result => {
        console.log(result.data.content.code);
      })
      .catch(err => console.log(err));

    return (
      <div style={{ margin: '0 auto' }}>
        <NemesisEntityField
          entityId={"unit"}
          currentUnitId={taxonId}
          onValueChange={this.onUnitChange}
          value={{ code: "number" }}
        />
      </div>
    );
  };

  onUnitChange = (value, taxonId) => {
    const arrayItems = this.state.expandedAttributes._embedded.taxon_attribute.slice(0);
    const itemIndex = arrayItems.findIndex(x => x.id === taxonId);
    arrayItems[itemIndex].unit = value.id;

    this.setState(prevState => ({
      expandedAttributes: {
        _embedded: {
          taxon_attribute: arrayItems
        }
      }
    })
    );
  };

  typeInput = (type, unitId) => {
    return (
      <div style={{ margin: '0 auto' }}>
        <NemesisEnumField
          value={this.state.taxonTypes.findIndex(x => x === type)}
          values={this.state.taxonTypes}
          currentUnitId={unitId}
          onValueChange={this.onTypeChange}
        />
      </div>
    );
  };

  onTypeChange = (value, unitId) => {
    const arrayItems = this.state.expandedAttributes._embedded.taxon_attribute.slice(0);
    const itemIndex = arrayItems.findIndex(x => x.id === unitId);
    arrayItems[itemIndex].type = value;

    this.setState(prevState => ({
      expandedAttributes: {
        _embedded: {
          taxon_attribute: arrayItems
        }
      }
    })
    );
  };

  saveDeleteTaxonAttr = (unitId) => {
    return (
      <div style={{ margin: '0 auto', textAlign: 'center' }}>
        <i className="save-icon-container material-icons"
          style={{ marginRight: '6px' }}
          onClick={() => this.saveTaxonReq(unitId)}>
          save
          </i>
        <i className="delete-icon-container material-icons"
          style={{ marginRight: '6px' }}
          onClick={() => this.handleDelete(unitId)}>
          delete_forever
          </i>
        <i className="material-icons" onClick={() => this.saveTaxonReq(unitId)} 
          style={{ marginRight: '6px' }}>
          edit
            </i>
      </div>
    );
  };

  handleDelete = (taxonId) => {
    const arrayItems = this.state.expandedAttributes._embedded.taxon_attribute.slice(0);
    const deleteTaxonIndex = arrayItems.findIndex(x => x.id === taxonId);
    arrayItems.splice(deleteTaxonIndex, 1);

    ApiCall.delete(`taxon_attribute/${taxonId}`)
      .then(result => {
        this.setState(prevState => ({
          expandedAttributes: {
            _embedded: {
              taxon_attribute: arrayItems
            }
          }
        })
        );
      });
  };

  saveTaxonReq = (unitId) => {
    const currentUnit = this.state.expandedAttributes._embedded.taxon_attribute.find(x => x.id === unitId);

    const unitObject = {
      ...(currentUnit.unit && { unit: currentUnit.unit }),
      ...(currentUnit.type && { type: currentUnit.type }),
      value: currentUnit.code || ""
    };

    ApiCall.patch(`taxon_attribute/${unitId}`, unitObject)
      .then(result => {
        this.openNotificationSnackbar('Taxon Saved Successfully!');
      });
  };
}
