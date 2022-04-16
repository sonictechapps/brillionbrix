import React, { useState, useRef, useEffect } from 'react'
import '../sass/currencyedittext.scss'
import { editTextBorderColor, getColor } from '../utils/utility'

const CurrencyEditText = ({ placeholder, defaultValue, id, onCurrencyChange, labelText, disabled, isReset, index, afterResetRadio, isInputHide, onCurrencyBlur }) => {
    const [value, setValue] = useState(`${defaultValue}` || '')
    const [initialValue, setInitialValue] = useState(defaultValue)
    const editRef = useRef()
    useEffect(() => {
        onChangeValue(value)
    }, [])

    useEffect(() => {
        if (defaultValue.toString() === '0' || defaultValue.toString() === '0.0' || defaultValue.toString() === '0.00') {
            setInitialValue(defaultValue)
            setCurrencyValue('')
        } else {
            setCurrencyValue(`${addCommaInNumber(defaultValue.split('$')[1] || defaultValue)}`)
        }

    }, [defaultValue])

    useEffect(() => {
        isReset && setCurrencyValue('reset')
        isReset && afterResetRadio && afterResetRadio(index, initialValue)
    }, [isReset])


    const addCommaInNumber = (number) => {
        const nonDecimal = number.split('.')[0].split('')
        const decimal = number.split('.')[1]
        let i = 0
        for (let j = nonDecimal.length - 1; j >= 0; j--) {
            if (i % 3 === 0 && (j !== nonDecimal.length - 1)) {
                nonDecimal[j] = nonDecimal[j] + ','
            }
            i++
        }
        return decimal !== undefined ? `${nonDecimal.join('')}.${decimal}` : nonDecimal.join('')
    }

    const onChangeValue = (value) => {
        let pattern = /((^\$|^\$(^[1-9]+[0-9]*\.?[0-9]*$|^\.?.[1-9]+$|[1-9]+[0-9]*$|([1-9]+[0-9]*(\,[0-9]+)*\.?[0-9]*)$)))$/gm
        if ((value !== '$') && value.match(pattern)) {
            let floatValue = (addCommaInNumber(value.split('$')[1].split(',').join('')) || '')
            onCurrencyChange(`${floatValue.split(',').join('')}`, id, index)
            return
        }
        let pattern1 = /(^[1-9]+[0-9]*\.?[0-9]*$|^\.?.[1-9]+$|[1-9]+[0-9]*$|([1-9]+[0-9]*(\,[0-9]+)*\.?[0-9]*)$)$/gm
        if ((value !== '$') && value.match(pattern1)) {
            onCurrencyChange(`${value.split(',').join('')}`, id, index)
            return
        }
        if (value === '$') {
            onCurrencyChange('', id, index)
            setValue('')
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
        onCurrencyBlur && onCurrencyBlur()
    }

    const setCurrencyValue = (value) => {
        let updatedValue
        if (value === 'reset') {
            if (initialValue.toString() === '0' || initialValue.toString() === '0.0' || initialValue.toString() === '0.00') {
                updatedValue = ''
            } else {
                updatedValue = `$${initialValue}`
            }
        } else {
            if (value === '') {
                updatedValue = ''
            } else {
                updatedValue = `$${value}`
            }
        }
        setValue(updatedValue)
    }
    return (
        <div style={{ position: 'relative', marginTop: '20px' }} className='edit-currency'> 
            <div className="currency-text" id={`currency-text-${id}`}>
                {labelText && <div className="label-holder-currency"><label>{labelText}</label></div>}
                <input type="text" placeholder={`$${['0', '0.0', '0.00'].includes(initialValue) ? initialValue : ''}`} value={value} ref={editRef}
                    disabled={disabled || false} onFocus={onFocus}
                    onBlur={onBlur} style={{ display: disabled && isInputHide ? 'none' : 'block' }}
                    onChange={(e) => onChangeValue(e.target.value)} />
            </div>
            <div id={`currency-edit-disabled-${id}`} onClick={(e) => onCurencyExpand(e)}></div>
        </div>
    )
}

export default CurrencyEditText