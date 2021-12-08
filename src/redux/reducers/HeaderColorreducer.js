const initialState = {
    color: ''
}

const headerColorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_COLOR' :
            return {
                color: action.data
            }
        default: return state
    }
}

export default headerColorReducer