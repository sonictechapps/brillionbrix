import React, { useState, useRef, useEffect } from 'react'
import '../sass/currencyedittext.scss'
import { editTextBorderColor, getColor } from '../utils/utility'

const PercentageEditText = ({ placeholder, defaultValue, id, onPercentageChange, labelText, disabled, isReset, index, afterResetRadio, isInputHide }) => {
    const [value, setValue] = useState(`${parseFloat(defaultValue).toFixed(2).toString()}` || '')
    const [initialValue, setInitialValue] = useState(parseFloat(defaultValue).toFixed(2).toString())
    const editRef = useRef()

    useEffect(() => {
        onChangeValue(value)
    }, [])

    useEffect(() => {
        isReset && setPercentageValue(initialValue)
        isReset && afterResetRadio && afterResetRadio(index, initialValue)
    }, [isReset])

    useEffect(() => {
        if (defaultValue.toString() === '0' || defaultValue.toString() === '0.0' || defaultValue.toString() === '0.00') {
            setPercentageValue('')
        } else {
            setPercentageValue(`${defaultValue}`)
        }



    }, [defaultValue])

    const onChangeValue = (value) => {
        let pattern = /(^([0-9]+\.?[0-9]*|\.?[0-9]+))$/gm
        if (value.match(pattern) !== null) {
            onPercentageChange(`${value}`, id, index)
            return
        }
        let pattern1 = /(^[1-9]+[0-9]*\.?[0-9]*$|^\.?.[0-9]+$|[1-9]+[0-9]*$)$/gm
        if (value !== '' && value.match(pattern1)) {
            let floatValue = (value || '')
            onPercentageChange(`${floatValue}`, id, index)
            return
        }
        
        if (value === '') {
            setValue('')
            onPercentageChange('', id, index)
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

    const setPercentageValue = (value) => {
        setValue(value)
    }

    return (
        <div style={{ position: 'relative', marginTop: '20px' }} className='edit-pecentage'>
            <div className="currency-text percentage-text" id={`currency-text-${id}`}>
                {labelText && <div className="label-holder-currency"><label>{labelText}</label></div>}

                <input type="text" placeholder={`${['0','0.0','0.00'].includes(initialValue) ? initialValue : ''}`} value={value} ref={editRef}
                    disabled={disabled || false} onFocus={onFocus}
                    onBlur={onBlur} style={{ display: disabled && isInputHide ? 'none' : 'block' }}
                    onChange={(e) => onChangeValue(e.target.value)} />
                <span>%</span>

            </div>
            <div id={`currency-edit-disabled-${id}`} onClick={(e) => onCurencyExpand(e)}></div>
        </div>
    )
}

export default PercentageEditText