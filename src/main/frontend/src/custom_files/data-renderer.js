import React, { Component } from 'react';
import asd from '../app/components/data-renderer'

export default class SomeClass extends asd {
  getData() {
    var arr = super.getData();
    arr.push({name: 'ccc'});
    return arr;
  }
}