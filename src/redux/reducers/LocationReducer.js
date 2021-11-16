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
            break

        case LOCATION_GET_SUCCESS:
            return {
                ...state,
                location: action.data,
                error: ''
            }
            break

        case LOCATION_GET_ERROR:
            return {
                ...state,
                location: [],
                error: action.data
            }
            break
    }
    return state
}

export default locationReducer