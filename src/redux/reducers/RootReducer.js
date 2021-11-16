import { combineReducers } from 'redux';
import locationReducer from './LocationReducer';
import inputReducer from './InputReducer';

export default combineReducers({
    location: locationReducer,
    input: inputReducer
});