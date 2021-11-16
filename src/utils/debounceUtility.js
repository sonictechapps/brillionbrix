const searchDebounce = (d) => {
    let timer
    return (fn) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn && fn()
        }, d)
    }

}

export const searchWithDebounce = searchDebounce(500)