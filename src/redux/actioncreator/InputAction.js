import { LOADING_DATA } from '../actioncreator/LoadingAction'
export const INPUT_GET_SUCCESS = 'INPUT_GET_SUCCESS'
export const INPUT_GET_ERROR = 'INPUT_GET_ERROR'
export const INPUT_SUBMIT_SUCCESS = 'INPUT_SUBMIT_SUCCESS'
export const INPUT_SUBMIT_ERROR = 'INPUT_SUBMIT_ERROR'


export const loadingData = () => {
    return {
        type: LOADING_DATA
    }
}

export const onInputSuccess = (data) => {
    return {
        type: INPUT_GET_SUCCESS,
        data
    }
}

export const onInputSubmitSuccess = (data) => {
    return {
        type: INPUT_SUBMIT_SUCCESS,
        data
    }
}

export const onInputFailure = (data) => {
    return {
        type: INPUT_GET_ERROR,
        data
    }
}

export const onInputSubmitFailure = (data) => {
    return {
        type: INPUT_SUBMIT_ERROR,
        data
    }
}