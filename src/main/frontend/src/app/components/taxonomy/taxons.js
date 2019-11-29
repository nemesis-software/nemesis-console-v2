import React, { Component } from "react";
import ApiCall from "servicesDir/api-call";
import Button from "react-bootstrap/lib/Button";
import _ from "lodash";
import { componentRequire } from "../../utils/require-util";
import ConsolePopup from "../../custom-components/backend-console-popup";
import counterpart from "counterpart";
import NemesisEntityField from "../field-components/nemesis-entity-field/nemesis-entity-field";
import EntitiesPager from "../entity-window/entities-viewer/entities-pager/entities-pager";
import TaxonAttributeRow from "./taxon-attribute-row";
import DataHelper from "servicesDir/data-helper";
import NotificationSystem from "react-notification-system";

let NemesisHeader = componentRequire(
  "app/components/nemesis-header/nemesis-header",
  "nemesis-header"
);

export default class Taxons extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = null;
    this.state = {
      taxonAttributes: [],
      selectedTaxon: null,
      selectedTaxonAttribute: null,
      openBackendConsolePopup: false,
      isLoading: true
    };
  }

  componentWillMount() {
    this.setState({ isLoading: false });
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
              this.setState({ ...this.state, openBackendConsolePopup: false })
            }
          />
        ) : (
          false
        )}
        {this.state.selectedTaxon ? (
          <div
            className="entities-table-viewer"
            key={this.state.selectedTaxon.id}
          >
            <table>
              <thead>
                <tr>
                  <th>Taxon Attributes</th>
                  <th>Name</th>
                  <th>Unit</th>
                  <th>TYPE</th>
                  <th>Default Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.taxonAttributes.map(taxonAttribute => (
                  <TaxonAttributeRow
                    openNotificationSnackbar={
                      this.props.openNotificationSnackbar
                    }
                    setLoadingStatus={this.setLoadingStatus.bind(this)}
                    taxonAttributeID={this.state.selectedTaxon.id}
                    key={taxonAttribute.code}
                    taxonAttribute={taxonAttribute}
                  />
                ))}
              </tbody>
            </table>
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
  }

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
    ApiCall.get("taxon/" + selectedTaxon.id + "/taxonAttributes", {
      projection: "search"
    }).then(result => {
      console.log(result);
      this.setState({
        ...this.state,
        taxonAttributes: DataHelper.mapCollectionData(result.data),
        selectedTaxon: selectedTaxon,
        isLoading: false
      });
    });
  }

  assignNewTaxonAttribute() {
    var self = this;
    var taxonAttributeIds = [];

    this.state.taxonAttributes.forEach(el => taxonAttributeIds.push(el.id));
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
}
