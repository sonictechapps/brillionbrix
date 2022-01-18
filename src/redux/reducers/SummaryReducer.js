import { LOADING_DATA } from '../actioncreator/LoadingAction'
import { SUMMARY_GET_SUCCESS, SUMMARY_GET_ERROR } from '../actioncreator/SummaryAction'

const initialState = {
    loadingData: false,
    summary: {},
    error: ''
}

const summaryReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loadingData: true
            }

        case SUMMARY_GET_SUCCESS:
            return {
                ...state,
                summary: action.data,
                error: ''
            }

        case SUMMARY_GET_ERROR:
            return {
                ...state,
                summary: {},
                error: action.data
            }
        default: return state
    }
    return state
}

export default summaryReducer