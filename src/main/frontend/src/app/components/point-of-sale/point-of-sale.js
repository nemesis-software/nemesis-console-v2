import React, {Component} from 'react';

import '../../../styles/pos.less';

import ApiCall from '../../services/api-call'
import {componentRequire} from '../../utils/require-util'

import _ from 'lodash';

import Translate from 'react-translate-component';
import BillPanel from './bill-panel/bill-panel';
import ProductPanel from './product-panel/product-panel';

export default class PointOfSale extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="point-of-sale-container">
        <div style={{padding: '60px'}}>
          <BillPanel />
          <ProductPanel />
        </div>
      </div>
    )
  }
}