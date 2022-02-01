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
    return {
         boxShadow: `0 2px 5px 0 ${getColor()}, 0 2px 10px 0 ${getColor()}`
    }

}

export const isNextButton = (fn) => {
    const style = {
        color: getColor()
    }
    return (
        <span onClick={()=>fn()} style={style}>{constantValues.CLICK_HERE}</span>
    )
}



export const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

export const ordinal_suffix_of=(i)=> {
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