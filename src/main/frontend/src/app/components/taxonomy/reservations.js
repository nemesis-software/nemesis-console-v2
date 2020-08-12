import React, { Component } from 'react';
import Translate from "react-translate-component";
import Select from "react-select";
import NemesisEntityField from "../field-components/nemesis-entity-field/nemesis-entity-field";
import ApiCall from "servicesDir/api-call";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { componentRequire } from "../../utils/require-util";
import "react-big-calendar/lib/css/react-big-calendar.css";
moment.locale("en-GB");
import '../../../styles/taxonomy-panel.less';
let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

const events = [
    {
        'title': 'All Day Event very long title',
        'allDay': true,
        'start': new Date(2020, 7, 26),
        'end': new Date(2020, 8, 1)
    },
    {
        'title': 'Long Event',
        'start': new Date(2020, 7, 7),
        'end': new Date(2020, 7, 10)
    },
    {
        'title': 'DTS STARTS',
        'start': new Date(2020, 2, 13, 0, 0, 0),
        'end': new Date(2020, 2, 20, 0, 0, 0)
    },
    {
        'title': 'Birthday Party',
        'start': new Date(2020, 7, 17, 7, 0, 0),
        'end': new Date(2020, 7, 19, 10, 70, 0)
    },
    {
        'title': 'Birthday Party 2',
        'start': new Date(2020, 7, 22, 7, 0, 0),
        'end': new Date(2020, 7, 24, 10, 70, 0)
    },
    {
        'title': 'Birthday Party 7',
        'start': new Date(2020, 7, 26, 7, 0, 0),
        'end': new Date(2020, 7, 28, 10, 30, 0)
    },
]

const MyCalendar = props => (
    <div style={{ height: 700, padding: '10px' }}>
        <Calendar
            events={events}
            defaultDate={new Date()}
            localizer={momentLocalizer(moment)}
        />
    </div>
)

const allowedReservationEntities = ['product'];
const reservationTypeDefaultValue = { value: 'product', label: 'ProductEntity' };

export default class ProductReservations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedReservationType: null,
            selectedProduct: null,
            reservationTypes: []
        }
    }

    componentDidMount() {
        ApiCall.get("subtypes/abstract_taxonomable_entity")
            .then(result => {
                this.setState({ reservationTypes: result.data });
            });
    }

    getOptions = () => {
        return this.state.reservationTypes
            .filter(reservationType => allowedReservationEntities.includes(reservationType.id))
            .map(reservationType => {
                return { value: reservationType.id, label: reservationType.text };
            });
    };

    handleNewReservationTypeChange = (item) => {
        this.setState({ selectedReservationType: item });
    };

    onProductSelect = (value) => {
        if (!value) {
            this.setState({ selectedProduct: null });
            return;
        }
        this.setState({ isLoading: true }, () => {
            this.getProductReservation(value);
        });
    };

    getProductReservation = (selectedProduct) => {
        ApiCall.get(
            (this.state.selectedProductType != null
                ? this.state.selectedProductType.value
                : "") +
            "/" +
            selectedProduct.id +
            "/resolvedTaxons",
            { projection: "search" }
        ).then(result => {
            this.setState((prevState) => ({
                ...prevState,
                taxons: DataHelper.mapCollectionData(result.data),
                selectedProduct: selectedProduct,
                isLoading: false
            }));
        });
    }

    render() {
        return (
            <div>
                <NemesisHeader onRightIconButtonClick={() => { }} isOpenInFrame={this.isOpenInFrame} />
                <div className="nemesis-taxonomy-panel">
                    <div className="taxon-configuration">
                        <div className="entity-field-container">
                            <div className="entity-field-input-container">
                                <div>
                                    <Translate
                                        component="label"
                                        content={"main.ReservationType"}
                                        fallback="ReservationType"
                                    />
                                </div>
                                <Select
                                    className="entity-field"
                                    value={{
                                        value:
                                            this.state.selectedReservationType !== null
                                                ? this.state.selectedReservationType.value
                                                : reservationTypeDefaultValue.value,
                                        label:
                                            this.state.selectedReservationType != null
                                                ? this.state.selectedReservationType.label
                                                : reservationTypeDefaultValue.label
                                    }}
                                    onChange={item => this.handleNewReservationTypeChange(item)}
                                    options={this.getOptions()}
                                />
                            </div>
                        </div>
                        <NemesisEntityField
                            entityId={"product"
                            }
                            onValueChange={this.onProductSelect}
                            value={this.state.selectedReservationType}
                            label={"Product"}
                        />
                        <MyCalendar></MyCalendar>
                    </div>
                </div>
            </div>
        )
    }
}