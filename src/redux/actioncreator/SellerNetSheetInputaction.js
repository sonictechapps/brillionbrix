import { LOADING_DATA } from '../actioncreator/LoadingAction'
export const SELLER_NET_SHEET_INPUT_GET_SUCCESS = 'SELLER_NET_SHEET_INPUT_GET_SUCCESS'
export const SELLER_NET_SHEET_INPUT_GET_ERROR = 'SELLER_NET_SHEET_INPUT_GET_ERROR'
export const SELLER_NET_SHEET_INPUT_SUBMIT_SUCCESS = 'SELLER_NET_SHEET_INPUT_SUBMIT_SUCCESS'
export const SELLER_NET_SHEET_INPUT_SUBMIT_ERROR = 'SELLER_NET_SHEET_INPUT_SUBMIT_ERROR'
export const SELLER_NET_SHEET_RESET_INPUT_DATA = 'SELLER_NET_SHEET_RESET_INPUT_DATA'
export const SELLER_NET_SHEET_LOADING_SUBMIT_DATA = 'SELLER_NET_SHEET_LOADING_SUBMIT_DATA'
export const loadingData = () => {
    return {
        type: LOADING_DATA
    }
}

export const loadingSubmitData = () => {
    return {
        type: SELLER_NET_SHEET_LOADING_SUBMIT_DATA
    }
}

export const onInputSuccess = (data, value) => {
    return {
        type: SELLER_NET_SHEET_INPUT_GET_SUCCESS,
        data,
        value
    }
}

export const onInputSubmitSuccess = (data) => {
    return {
        type: SELLER_NET_SHEET_INPUT_SUBMIT_SUCCESS,
        data
    }
}


export const onInputFailure = (data) => {
    return {
        type: SELLER_NET_SHEET_INPUT_GET_ERROR,
        data
    }
}

export const onInputSubmitFailure = (data) => {
    return {
        type: SELLER_NET_SHEET_INPUT_SUBMIT_ERROR,
        data
    }
}

export const resetInputData = () => {
    return {
        type: SELLER_NET_SHEET_RESET_INPUT_DATA
    }
}