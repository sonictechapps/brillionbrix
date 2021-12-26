import { combineReducers } from 'redux';
import locationReducer from './LocationReducer';
import inputReducer from './InputReducer';
import sellerNetSheetInputReducer from './SellerNetSheetInputReducer';
import headerColorReducer from './HeaderColorreducer';

export default combineReducers({
    location: locationReducer,
    input: inputReducer,
    sellerinput: sellerNetSheetInputReducer,
    headerColor: headerColorReducer
});