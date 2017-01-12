import _ from 'lodash';
import {GET_DATA, SEARCH_DATA} from '../actions/types'

const data = [
  {name: 'test1'},
  {name: 'test2'},
  {name: 'test3'},
  {name: 'ala bala 3'},
];

var defaultStateValue = {all: data, searchedResult: data};

export default function(state = defaultStateValue, action) {
  switch (action.type) {
    case GET_DATA:
      return {...state, all: data};
    case SEARCH_DATA:
      let filteredResult = _.filter(data, item => item.name.indexOf(action.payload) > -1);
      console.log(filteredResult);
      return {...state, searchedResult: filteredResult};
    default:
      return state;
  }
}