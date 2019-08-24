import React, {Component} from 'react';

import '../../../styles/pos.less';

import ApiCall from '../../services/api-call'

import {componentRequire} from '../../utils/require-util'

let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

import _ from 'lodash';

import DataHelper from 'servicesDir/data-helper';

import BillPanel from './bill-panel/bill-panel';
import ProductPanel from './product-panel/product-panel';
import PaymentProcess from './payment-process/payment-process';

export default class PointOfSale extends Component {
  constructor(props) {
    super(props);
    this.state = {isPaymentProcess: false, products: [], cart: {products: [], totalPrice: 0}, selectedProductId: -1, isProductQuantityChanged: false};
  }

  componentWillMount() {
    ApiCall.get('variant/search/findByCatalogVersionCode', {
      projection: 'pos',
      catalogVersionCode: 'Online',
      page: 0,
      size: 50
    }).then(result => {
      this.setState({...this.state, products: DataHelper.mapCollectionData(result.data)});
    })
  }

  render() {
    return (
      <div className="point-of-sale-container">
        <NemesisHeader onRightIconButtonClick={() => {}} isOpenInFrame={this.isOpenInFrame}/>
        <div style={this.getContainerStyles(this.state.isPaymentProcess)}>
          <BillPanel cart={this.state.cart}
                     onKeyboardButtonClick={this.onKeyboardButtonClick.bind(this)}
                     onBillItemClick={this.onBillItemClick.bind(this)}
                     selectedProductId={this.state.selectedProductId}/>
          <ProductPanel onProductSelect={this.onProductSelect.bind(this)} products={this.state.products}/>
        </div>
        <div style={this.getContainerStyles(!this.state.isPaymentProcess)}>
          <PaymentProcess cart={this.state.cart} setIsPaymentProcess={this.setIsPaymentProcess.bind(this)} startNextOrder={this.startNextOrder.bind(this)}/>
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
    this.setState({...this.state, cart: cart, selectedProductId: product.id, isProductQuantityChanged: false});
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
    let style = {padding: '60px 0 0 60px'};
    if (shouldBeHidden) {
      style.display = 'none';
    }

    return style;
  }

  onKeyboardButtonClick(value) {
    if (value === 'payment') {
      if (this.state.cart.products.length === 0) {
        return;
      }
      this.setIsPaymentProcess(true);
      return;
    }

    let cartProducts = [...this.state.cart.products];

    let selectedProductIndex = _.findIndex(cartProducts, (item) => {
      return item.product.id === this.state.selectedProductId
    });

    if (selectedProductIndex === -1) {
      return;
    }

    let product = cartProducts[selectedProductIndex];

    if (value === 'delete') {
      if (product.quantity === 0) {
        cartProducts.splice(selectedProductIndex, 1);
        let newSelectedProductId = cartProducts.length > 0 ? cartProducts[cartProducts.length - 1].product.id : -1;
        let cart = {products: cartProducts, totalPrice: this.getCartTotalPrice(cartProducts)};
        this.setState({...this.state, cart: cart, isProductQuantityChanged: false, selectedProductId: newSelectedProductId});
        return;
      }

      if (this.state.isProductQuantityChanged && product.quantity.toString().length > 1) {
        let newQuantity = product.quantity.toString().slice(0, -1);
        cartProducts[selectedProductIndex].quantity = Number(newQuantity);
      } else {
        cartProducts[selectedProductIndex].quantity = 0;
      }

      let cart = {products: cartProducts, totalPrice: this.getCartTotalPrice(cartProducts)};
      this.setState({...this.state, cart: cart, isProductQuantityChanged: true});

      return;
    }

    if (isFinite(value)) {
      if (product.quantity === 0) {
        cartProducts[selectedProductIndex].quantity = Number(value);
      } else if (this.state.isProductQuantityChanged) {
        let newQuantity = product.quantity.toString() + value.toString();
        cartProducts[selectedProductIndex].quantity = Number(newQuantity);
      } else {
        cartProducts[selectedProductIndex].quantity = Number(value);
      }

      let cart = {products: cartProducts, totalPrice: this.getCartTotalPrice(cartProducts)};
      this.setState({...this.state, cart: cart, isProductQuantityChanged: true});
    }
  }

  onBillItemClick(itemId) {
    this.setState({...this.state, selectedProductId: itemId, isProductQuantityChanged: false});
  }

  setIsPaymentProcess(value) {
    this.setState({...this.state, isPaymentProcess: value});
  }

  startNextOrder() {
    this.setState({...this.state, isPaymentProcess: false, cart: {products: [], totalPrice: 0}, selectedProductId: -1, isProductQuantityChanged: false})
  }
}
