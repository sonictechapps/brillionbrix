import React, { useState, useRef, useEffect } from 'react'
import '../sass/currencyedittext.scss'
import { editTextBorderColor, getColor } from '../utils/utility'

const CurrencyEditText = ({ placeholder, defaultValue, id, onCurrencyChange, labelText, disabled, isReset, index, afterResetRadio, isInputHide }) => {
    const [value, setValue] = useState(`$${defaultValue}` || '')
    const editRef = useRef()

    useEffect(() => {
        onChangeValue(value)
    }, [])

    useEffect(() => {
        isReset && setValue(`$${defaultValue}`)
        afterResetRadio && afterResetRadio()
    }, [isReset])



    const onChangeValue = (value) => {
        console.log('00', value)
        let pattern = /(^\$|^\$([0-9]+\.?[0-9]*|\.?[0-9]+))$/gm
        if (value !== '' && value.match(pattern)) {
            console.log('11')
            let floatValue = (value.split('$')[1] || '')
            console.log('12')
            setValue(`$${floatValue}`)
            console.log('13')
            onCurrencyChange(`${floatValue}`, id, index)
        }
        if (value === '') {
            setValue('$')
        }
    }

    const onCurencyExpand = (e) => {
        const disabledDiv = document.querySelector(`#currency-edit-disabled-${id}`)
        disabledDiv.classList.remove('disable-currency-edit')
        const outerCurrencyDiv = document.querySelector(`#currency-text-${id}`)
        outerCurrencyDiv.classList.remove('currency-text-collapsed')
    }

    const onFocus = (e) => {
        e.target.style.borderColor = getColor()
    }

    const onBlur = (e) => {
        e.target.style.borderColor = editTextBorderColor
    }
    return (
        <div style={{ position: 'relative', marginTop: '20px' }} className='edit-currency'>
            <div className="currency-text" id={`currency-text-${id}`}>
                {labelText && <div className="label-holder-currency"><label>{labelText}</label></div>}
                <input type="text" placeholder={placeholder} value={value} ref={editRef}
                    disabled={disabled || false} onFocus={onFocus}
                    onBlur={onBlur} style={{display: disabled && isInputHide ? 'none': 'block'}}
                    onChange={(e) => onChangeValue(e.target.value)} />
            </div>
            <div id={`currency-edit-disabled-${id}`} onClick={(e) => onCurencyExpand(e)}></div>
        </div>
    )
}

export default CurrencyEditText