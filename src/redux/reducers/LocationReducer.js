import { LOADING_DATA } from '../actioncreator/LoadingAction'
import { LOCATION_GET_SUCCESS, LOCATION_GET_ERROR } from '../actioncreator/LocationAction'

const initialState = {
    loadingData: false,
    location: [],
    error: ''
}

const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loadingData: true
            }

        case LOCATION_GET_SUCCESS:
            return {
                ...state,
                location: action.data,
                error: ''
            }

        case LOCATION_GET_ERROR:
            return {
                ...state,
                location: [],
                error: action.data
            }
        default:
            return state
    }
    return state
}

export default locationReducer