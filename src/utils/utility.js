import { constantValues } from "./constants"

let color
let language
export const setColor = (bgcolor) => {
    color = bgcolor
}

export const setLanguage = (lang) => {
    language = lang
}

export const editTextBorderColor = '#ccc'

export const getColor = () => color

export const getLanguage = () => language

export const getCurrencyValidationRegexPattern = () => /^[0-9][0-9]*(\,[0-9]+)*(\.[0-9]+)?$/gm

export const setSubmitButtonStyle = () => ({
    backgroundColor: getColor()
})

export const getDefaultColor = () => {
    return 'white'
}

export const setCardShadow = () => {
    return {
        boxShadow: `0 2px 5px 0 ${getColor()}, 0 2px 10px 0 ${getColor()}`
    }

}

export const isNextButton = (fn) => {
    const style = {
        color: getColor()
    }
    return (
        <span onClick={() => fn()} style={style}>{`${getStingOnLanguage('CLICK_HERE')}`}</span>
    )
}

export const addCommaInNumber = (number) => {

    const nonDecimal = number.toString().split('.')[0].split('')
    const decimal = number.toString().split('.')[1]
    let i = 0
    for (let j = nonDecimal.length - 1; j >= 0; j--) {
        if (i % 3 === 0 && (j !== nonDecimal.length - 1)) {
            nonDecimal[j] = nonDecimal[j] + ','
        }
        i++
    }
    return decimal !== undefined ? `${nonDecimal.join('')}.${decimal}` : nonDecimal.join('')
}



export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const ordinal_suffix_of = (i) => {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

export const getStingOnLanguage = (value) => {
    if (getLanguage() === "ES") {
        let langes = value + '_ES'
        return constantValues[langes]
    } else {
        return constantValues[value]
    }
}

export const getStingOnAPILanguage = (object, value) => {
    if (object) {
        if (getLanguage().toLowerCase() === "es" ) {
            return object[value + '_es']
        } else {
            return object[value]
        }
    }
}

export const isInt = (val) => {
    return parseFloat(val) % 1 === 0
}

export const getTotal = (arr, key) => {
    if (arr?.length > 0) {
      let res = arr && arr.reduce(function (previousValue, currentValue) {
        let value
        if (currentValue[key]) {
          value = isInt(currentValue[key]) ? parseInt(currentValue[key]) : parseFloat(currentValue[key])
        } else {
          value = 0 
        }
        return previousValue + value
      }, 0);
      return parseFloat(res)
    } else {
      return arr ? (arr !== null && arr[key]) ? parseFloat(arr[key]) : 0.00 : 0.00
    }
  }