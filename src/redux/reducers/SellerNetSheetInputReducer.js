import { LOADING_DATA } from '../actioncreator/LoadingAction'
import { SELLER_NET_SHEET_INPUT_GET_SUCCESS, SELLER_NET_SHEET_INPUT_GET_ERROR } from '../actioncreator/SellerNetSheetInputaction'

const initialState = {
    loadingData: false,
    input: {},
    error: ''
}

const sellerNetSheetInputReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loadingData: true
            }

        case SELLER_NET_SHEET_INPUT_GET_SUCCESS:
            return {
                ...state,
                input: action.data,
                error: ''
            }

        case SELLER_NET_SHEET_INPUT_GET_ERROR:
            return {
                ...state,
                input: {},
                error: action.data
            }
        default: return state
    }
}

export default sellerNetSheetInputReducer