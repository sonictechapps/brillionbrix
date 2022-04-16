import { LOADING_DATA } from '../actioncreator/LoadingAction'
import {
    SELLER_NET_SHEET_INPUT_GET_SUCCESS, SELLER_NET_SHEET_INPUT_GET_ERROR, SELLER_NET_SHEET_INPUT_SUBMIT_SUCCESS,
    SELLER_NET_SHEET_INPUT_SUBMIT_ERROR, SELLER_NET_SHEET_RESET_INPUT_DATA, SELLER_NET_SHEET_LOADING_SUBMIT_DATA
} from '../actioncreator/SellerNetSheetInputaction'

const initialState = {
    loadingResponseData: true,
    loadingBlankScreen: true,
    input: {},
    inputsubmit: {},
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

        case SELLER_NET_SHEET_LOADING_SUBMIT_DATA:
            return {
                ...state,
                loadingResponseData: true,
                loadingBlankScreen: false
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
                inputsubmit: {},
                loadingResponseData: false,
                loadingBlankScreen: false,
                error: action.data
            }
        case SELLER_NET_SHEET_INPUT_SUBMIT_SUCCESS:
            return {
                ...state,
                inputsubmit: action.data,
                loadingResponseData: false,
                loadingBlankScreen: false,
                error: ''
            }

        case SELLER_NET_SHEET_INPUT_SUBMIT_ERROR:
            return {
                ...state,
                inputsubmit: {},
                input: {},
                loadingResponseData: false,
                loadingBlankScreen: false,
                error: action.data
            }
        case SELLER_NET_SHEET_RESET_INPUT_DATA:
            return initialState
        default: return state
    }
}

export default sellerNetSheetInputReducer