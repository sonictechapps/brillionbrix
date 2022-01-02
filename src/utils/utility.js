import { constantValues } from "./constants"

let color
export const setColor = (bgcolor) => {
    color = bgcolor
}

export const editTextBorderColor = '#ccc'

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

export const getDefaultColor = () => {
    return 'white'
}

export const setCardShadow = () => {
    const red = hexToRgb(getColor())?.r
    const green = hexToRgb(getColor())?.g
    const blue = hexToRgb(getColor())?.b
    return {
        boxShadow: `0 4px 8px 0 rgba(${red}, ${green}, ${blue}, 0.7)`
    }

}

export const isNextButton = (fn) => {
    const style = {
        color: getColor()
    }
    return (
        <span onClick={fn} style={style}>{constantValues.CLICK_HERE}</span>
    )
}



