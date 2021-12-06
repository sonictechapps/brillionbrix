import { LOADING_DATA } from '../actioncreator/LoadingAction'
import { INPUT_GET_SUCCESS, INPUT_GET_ERROR } from '../actioncreator/InputAction'

const initialState = {
    loadingData: false,
    input: {},
    error: ''
}

const inputReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loadingData: true
            }

        case INPUT_GET_SUCCESS:
            return {
                ...state,
                input: action.data,
                error: ''
            }

        case INPUT_GET_ERROR:
            return {
                ...state,
                input: {},
                error: action.data
            }
        default: return state
    }
}

export default inputReducer