import { LOADING_DATA } from '../actioncreator/LoadingAction'
import { INPUT_GET_SUCCESS, INPUT_GET_ERROR, INPUT_SUBMIT_SUCCESS, INPUT_SUBMIT_ERROR, RESET_INPUT_DATA, LOADING_SUBMIT_DATA } from '../actioncreator/InputAction'

const initialState = {
    loadingResponseData: true,
    loadingBlankScreen: true,
    input: {},
    inputsubmit: {},
    error: ''
}

const inputReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loadingResponseData: true,
                loadingBlankScreen: true
            }

        case LOADING_SUBMIT_DATA:
            return {
                ...state,
                loadingResponseData: true,
                loadingBlankScreen: false
            }

        case INPUT_GET_SUCCESS:
            return {
                ...state,
                input: action.data.response.body,
                loadingResponseData: false,
                loadingBlankScreen: false,
                error: ''
            }

        case INPUT_GET_ERROR:
            return {
                ...state,
                input: {},
                inputsubmit: {},
                loadingResponseData: false,
                loadingBlankScreen: false,
                error: action.data
            }

        case INPUT_SUBMIT_SUCCESS:
            return {
                ...state,
                inputsubmit: action.data,
                loadingResponseData: false,
                loadingBlankScreen: false,
                error: ''
            }

        case INPUT_SUBMIT_ERROR:
            return {
                ...state,
                inputsubmit: {},
                input: {},
                loadingResponseData: false,
                loadingBlankScreen: false,
                error: action.data
            }
        case RESET_INPUT_DATA:
            return initialState
        default: return state
    }
}

export default inputReducer