import {SEARCH_DATA, GET_DATA} from './types';

export function searchData(searchName) {
  return {
    type: SEARCH_DATA,
    payload: searchName
  }
}

export function getData() {
  return {
    type: GET_DATA,
    payload: null
  }
}