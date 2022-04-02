import { LOADING_DATA } from '../actioncreator/LoadingAction'
export const SELLER_NET_SHEET_INPUT_GET_SUCCESS = 'SELLER_NET_SHEET_INPUT_GET_SUCCESS'
export const SELLER_NET_SHEET_INPUT_GET_ERROR = 'SELLER_NET_SHEET_INPUT_GET_ERROR'

export const loadingData = () => {
    return {
        type: LOADING_DATA
    }
}

export const onInputSuccess = (data) => {
    return {
        type: SELLER_NET_SHEET_INPUT_GET_SUCCESS,
        data
    }
}

export const onInputFailure = (data) => {
    return {
        type: SELLER_NET_SHEET_INPUT_GET_ERROR,
        data
    }
}