import { LOADING_DATA } from '../actioncreator/LoadingAction'
export const SUMMARY_GET_SUCCESS = 'SUMMARY_GET_SUCCESS'
export const SUMMARY_GET_ERROR = 'SUMMARY_GET_ERROR'


export const loadingData = () => {
    return {
        type: LOADING_DATA
    }
}

export const onSummarySuccess = (data) => {
    return {
        type: SUMMARY_GET_SUCCESS,
        data
    }
}

export const onSummaryFailure = (data) => {
    return {
        type: SUMMARY_GET_ERROR,
        data
    }
}