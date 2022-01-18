import { LOADING_DATA } from '../actioncreator/LoadingAction'
import { INPUT_GET_SUCCESS, INPUT_GET_ERROR, INPUT_SUBMIT_SUCCESS, INPUT_SUBMIT_ERROR } from '../actioncreator/InputAction'

const initialState = {
    loadingData: false,
    input: {},
    inputsubmit: {},
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
                input: action.data.response.body,
                error: ''
            }

        case INPUT_GET_ERROR:
            return {
                ...state,
                input: {},
                inputsubmit: {},
                error: action.data
            }

        case INPUT_SUBMIT_SUCCESS:
            return {
                ...state,
                inputsubmit: action.data.response.body,
                error: ''
            }

        case INPUT_SUBMIT_ERROR:
            return {
                ...state,
                inputsubmit: {},
                input: {},
                error: action.data
            }
        default: return state
    }
}

export default inputReducer