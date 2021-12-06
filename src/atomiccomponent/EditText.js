import React, { useState } from 'react'
import '../sass/currencyedittext.scss'
import { getColor } from '../utils/utility'

const EditText = ({ placeholder, id, onChange, labelText, defaultValue, onBlur }) => {
    const [value, setValue] = useState(defaultValue || '')
    const onTextChange = (e) => {
        setValue(e.target.value)
        onChange(e.target.value)
    }

    const onFocus = (e) => {
        console.log('hhh')
        e.target.style.borderColor = getColor()
    }

    const onEditBlur = (e) => {
        console.log('hhh')
        e.target.style.borderColor = '#ccc'
        onBlur(value)
    }
    return (
        <div style={{ position: 'relative' }}>
            <div className="currency-text" id={`currency-text-${id}`}>
                <div className="label-holder"><label>{labelText}</label>
                    <input type="text" placeholder={placeholder} defaultValue={value} value={value}
                        onChange={(e) => onTextChange(e)} onBlur={(e) => onEditBlur(e)} onFocus={(e) => onFocus(e)} /></div>
            </div>
        </div>
    )
}

export default EditText