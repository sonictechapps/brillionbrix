import { LOADING_DATA } from '../actioncreator/LoadingAction'
export const LOCATION_GET_SUCCESS = 'LOCATION_GET_SUCCESS'
export const LOCATION_GET_ERROR = 'LOCATION_GET_ERROR'


export const loadingData = () => {
    return {
        type: LOADING_DATA
    }
}

export const onLocationSuccess = (data) => {
    return {
        type: LOCATION_GET_SUCCESS,
        data
    }
}

export const onLocationFailure = (data) => {
    return {
        type: LOCATION_GET_ERROR,
        data
    }
}