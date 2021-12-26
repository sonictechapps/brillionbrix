import React, { useRef, useState } from 'react'
import { getColor, getDefaultColor } from '../utils/utility'

const RadioInput = ({ option, options, onChange, value, index, id, name, images }) => {
    const inputRef = useRef()
    const [isHover, setHover] = useState(false)
    const onMouseHover = () => {
        setHover(true)
    }

    const onMouseLeave = () => {
       

        setHover(false)
    }
    return (
        <div className={`radio-options-div col-12 col-md-${12 / options.length}`} onClick={(e) => onChange(index, e)}

        >
            <label className={`radio-label-${id}-${index}`}>
                <input className={`radio-input-${id}-${index}`} type="radio" name={name} value={option.value} id={option.value} checked={value == option.value} ref={inputRef} />
                <img id={`radio-img-${id}-${index}`} src={images[index]}
                    onMouseLeave={onMouseLeave} onMouseOver={onMouseHover}
                    style={isHover ? { backgroundColor: getColor() } : inputRef.current?.checked ? { backgroundColor: getColor() } : { backgroundColor: getDefaultColor() }} />
            </label>
            <div>
                <p>{option.name}</p>
            </div>
        </div>
    )
}

export default RadioInput