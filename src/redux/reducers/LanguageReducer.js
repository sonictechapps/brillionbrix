const initialState = {
    language: 'EN'
}

const languageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_LANGUAGE' :
            return {
                color: action.data.color,
                title: action.data.title
            }
        default: return state
    }
}

export default headerColorReducer