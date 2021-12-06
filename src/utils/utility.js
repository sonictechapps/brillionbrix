
let color
export const setColor = (bgcolor) => {
    console.log('color-->', bgcolor)
    color = bgcolor
}

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

export const getColor = () => color

export const setSubmitButtonStyle = () => ({
    backgroundColor: getColor()
})

export const setCardShadow = () => {
    const red = hexToRgb(getColor())?.r
    const green = hexToRgb(getColor())?.g
    const blue = hexToRgb(getColor())?.b
    console.log('899', red, ' ', green, ' ', red)
    return {
        boxShadow: `0 4px 8px 0 rgba(${red}, ${green}, ${blue}, 0.7)`
    }

}



