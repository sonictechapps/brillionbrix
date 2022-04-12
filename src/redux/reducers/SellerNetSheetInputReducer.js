import { LOADING_DATA } from '../actioncreator/LoadingAction'
import { SELLER_NET_SHEET_INPUT_GET_SUCCESS, SELLER_NET_SHEET_INPUT_GET_ERROR } from '../actioncreator/SellerNetSheetInputaction'

const initialState = {
    loadingResponseData: true,
    loadingBlankScreen: true,
    input: {},
    error: '',
    value: ''
}

const sellerNetSheetInputReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loadingResponseData: true,
                loadingBlankScreen: true
            }

        case SELLER_NET_SHEET_INPUT_GET_SUCCESS:
            return {
                ...state,
                input: action.data.response.body,
                loadingResponseData: false,
                loadingBlankScreen: false,
                value: action.value,
                error: ''
            }

        case SELLER_NET_SHEET_INPUT_GET_ERROR:
            return {
                ...state,
                input: {},
                loadingResponseData: false,
                loadingBlankScreen: false,
                error: action.data
            }
        default: return state
    }
}

export default sellerNetSheetInputReducer