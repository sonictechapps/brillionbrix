import { LOADING_DATA } from './LoadingAction'
export const SHELLER_SHEET_GET_SUCCESS = 'SHELLER_SHEET_GET_SUCCESS'
export const SHELLER_SHEET_GET_ERROR = 'SHELLER_SHEET_GET_ERROR'


export const loadingData = () => {
    return {
        type: LOADING_DATA
    }
}

export const onShellerSheetSuccess = (data) => {
    return {
        type: SHELLER_SHEET_GET_SUCCESS,
        data
    }
}

export const onShellerSheetFailure = (data) => {
    return {
        type: SHELLER_SHEET_GET_ERROR,
        data
    }
}