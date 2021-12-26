import React, { useEffect, useState } from 'react'
import '../sass/currencyedittext.scss'
import { editTextBorderColor, getColor } from '../utils/utility'

const EditText = ({ placeholder, id, onChange, labelText, defaultValue, onBlur, disabled }) => {
    const [value, setValue] = useState(defaultValue || '')
    const onTextChange = (e) => {
        setValue(e.target.value)
        onChange(e.target.value)
    }

    const onFocus = (e) => {
        e.target.style.borderColor = getColor()
    }

    const onEditBlur = (e) => {
        e.target.style.borderColor = editTextBorderColor
        onBlur && onBlur(value)
    }

    useEffect(()=> {
        if (disabled) {
            setValue(defaultValue || '')
            onChange(defaultValue || '')
        }
    },[disabled])
    
    return (
        <div style={{ position: 'relative' }}>
            <div className="currency-text" id={`currency-text-${id}`}>
                <div className="label-holder"><label>{labelText}</label>
                    <input type="text" placeholder={placeholder} defaultValue={value} value={value} disabled={disabled}
                        onChange={(e) => onTextChange(e)} onBlur={(e) => onEditBlur(e)} onFocus={(e) => onFocus(e)} /></div>
            </div>
        </div>
    )
}

export default EditText