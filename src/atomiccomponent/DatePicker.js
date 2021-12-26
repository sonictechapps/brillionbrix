import React from 'react'
import '../sass/currencyedittext.scss'
import * as moment from 'moment'
import { editTextBorderColor, getColor } from '../utils/utility'

const DatePicker = ({ id, labelText, defaultValue, onDateChange }) => {
    const dateDefault = moment(new Date(defaultValue)).format('YYYY-MM-DD')

    const onFocus = (e) => {
        e.target.style.borderColor = getColor()
    }

    const onBlur = (e) => {
        e.target.style.borderColor = editTextBorderColor
    }

    const onChange = (e) => {
        onDateChange(e.target.value)
    }
    return (
        <div style={{ position: 'relative', marginTop: '20px' }}>
            <div className="currency-text" id={`currency-text-${id}`}>
                <div className="label-holder-currency"><label>{labelText}</label>
                    <input type="date" defaultValue={dateDefault} pattern="\d{4}/\d{2}/\d{2}" onFocus={onFocus}
                        onBlur={onBlur} onChange={(e) => onChange(e)}
                    /></div>
            </div>
        </div>

    )
}

export default DatePicker