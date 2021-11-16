import { LOADING_DATA } from '../actioncreator/LoadingAction'
export const INPUT_GET_SUCCESS = 'INPUT_GET_SUCCESS'
export const INPUT_GET_ERROR = 'INPUT_GET_ERROR'


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

export const onInputFailure = (data) => {
    return {
        type: INPUT_GET_ERROR,
        data
    }
}