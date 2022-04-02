import { LOADING_DATA } from '../actioncreator/LoadingAction'
import { SHELLER_SHEET_GET_SUCCESS, SHELLER_SHEET_GET_ERROR } from '../actioncreator/ShellerSheetAction'

const initialState = {
    loadingData: false,
    sellerSheet: {},
    error: ''
}

const shellerSheetReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loadingData: true
            }

        case SHELLER_SHEET_GET_SUCCESS:
            return {
                ...state,
                sellerSheet: action.data,
                error: ''
            }

        case SHELLER_SHEET_GET_ERROR:
            return {
                ...state,
                sellerSheet: {},
                error: action.data
            }
        default: return state
    }
    return state
}

export default shellerSheetReducer