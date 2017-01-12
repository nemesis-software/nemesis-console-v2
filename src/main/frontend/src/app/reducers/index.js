import { combineReducers } from 'redux';
import dataReducer from './data-reducer';

const rootReducer = combineReducers({
  testData: dataReducer
});

export default rootReducer;
