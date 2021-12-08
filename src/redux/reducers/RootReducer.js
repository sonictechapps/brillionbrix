import { combineReducers } from 'redux';
import locationReducer from './LocationReducer';
import inputReducer from './InputReducer';
import headerColorReducer from './HeaderColorreducer';

export default combineReducers({
    location: locationReducer,
    input: inputReducer,
    headerColor: headerColorReducer
});