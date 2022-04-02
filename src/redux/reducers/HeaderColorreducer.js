const initialState = {
    color: '',
    title: ''
}

const headerColorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_COLOR' :
            return {
                color: action.data.color,
                title: action.data.title,
                logo: action.data.logo
            }
        default: return state
    }
}

export default headerColorReducer