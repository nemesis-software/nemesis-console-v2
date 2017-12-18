import React, {Component} from 'react';

import '../../../styles/pos.less';

import ApiCall from '../../services/api-call'

import _ from 'lodash';

import BillPanel from './bill-panel/bill-panel';
import ProductPanel from './product-panel/product-panel';
import PaymentProcess from './payment-process/payment-process';

export default class PointOfSale extends Component {
  constructor(props) {
    super(props);
    this.state = {isPaymentProcess: false, products: [], cart: {products: [], totalPrice: 0}};
  }

  componentWillMount() {
    ApiCall.get('variant/search/findByCatalogVersionCatalogCodeAndCatalogVersionCode', {
      projection: 'pos',
      catalogCode: 'samplestoreB2CProductCatalog',
      catalogVersionCode: 'Online',
      page: 0,
      size: 50
    }).then(result => {
      this.setState({...this.state, products: this.mapCollectionData(result.data)});
    })
  }

  render() {
    return (
      <div className="point-of-sale-container">
        <div style={this.getContainerStyles(this.state.isPaymentProcess)}>
          <BillPanel cart={this.state.cart} setIsPaymentProcess={this.setIsPaymentProcess.bind(this)}/>
          <ProductPanel onProductSelect={this.onProductSelect.bind(this)} products={this.state.products}/>
        </div>
        <div style={this.getContainerStyles(!this.state.isPaymentProcess)}>
          <PaymentProcess setIsPaymentProcess={this.setIsPaymentProcess.bind(this)}/>
        </div>
      </div>
    )
  }

  onProductSelect(product) {
    let cartProducts = [...this.state.cart.products];

    let itemIndex = _.findIndex(cartProducts, (item) => {
      return item.product.id === product.id
    });

    if (itemIndex > -1) {
      cartProducts[itemIndex].quantity += 1;
    } else {
      cartProducts.push({
        quantity: 1,
        product: product
      })
    }

    let cart = {products: cartProducts, totalPrice: this.getCartTotalPrice(cartProducts)};
    this.setState({...this.state, cart: cart});
  }

  getCartTotalPrice(cartProducts) {
    let result = 0;

    _.forEach(cartProducts, item => {
      let itemPrice = Number(item.product.price.split(',')[0]);
      result += item.quantity * itemPrice;
    });

    return Number(result).toFixed(2);
  }

  getContainerStyles(shouldBeHidden) {
    let style = {padding: '60px'};
    if (shouldBeHidden) {
      style.display = 'none';
    }

    return style;
  }

  setIsPaymentProcess(value) {
    this.setState({...this.state, isPaymentProcess: value});
  }

  mapCollectionData(data) {
    let result = [];

    if (!data) {
      return result;
    }

    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }
}