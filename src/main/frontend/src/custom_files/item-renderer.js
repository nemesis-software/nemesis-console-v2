import React, { Component } from 'react';
import asd from '../app/components/item-renderer'

export default class ItemRenderer extends asd {
  constructor(props) {
    super(props);
  }

  someLogger() {
    console.log('render shits');
  }
}