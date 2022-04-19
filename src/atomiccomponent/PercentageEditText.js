import React, { useState, useRef, useEffect } from 'react'
import '../sass/currencyedittext.scss'
import { editTextBorderColor, getColor } from '../utils/utility'

const PercentageEditText = ({ placeholder, defaultValue, id, onPercentageChange, labelText, disabled, isReset, index, afterResetRadio, isInputHide }) => {
    const [value, setValue] = useState(`${parseFloat(defaultValue).toFixed(2).toString()}` || '')
    const [initialValue, setInitialValue] = useState(parseFloat(defaultValue).toFixed(2).toString())
    const editRef = useRef()

    const setCaretPosition = (ctrl, pos) => {
        // Modern browsers
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        } else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
    
    useEffect(() => {
        onChangeValue(value)
    }, [])

  

    useEffect(() => {
        isReset && setPercentageValue('')
        isReset && afterResetRadio && afterResetRadio(index, initialValue)
    }, [isReset])

    useEffect(() => {
        if (defaultValue.toString() === '0' || defaultValue.toString() === '0.0' || defaultValue.toString() === '0.00') {
            setPercentageValue('')
            setInitialValue(defaultValue)
        } else {
            setPercentageValue(`${defaultValue.split('%')[0] || defaultValue}`)
        }

        

    }, [defaultValue])

    const onChangeValue = (value) => {
        if (value === '%') {
            setValue('')
            return
        }
        let pattern = /(^%|^([0-9]+\.?[0-9]*|\.?[0-9]+)%)$/gm
        if (value.includes('%') && value.match(pattern)) {
            let floatValue = value.split('%')[0] || ''
            onPercentageChange(`${floatValue}`, id, index)
            return
        }
        let pattern1 = /(^[1-9]+[0-9]*\.?[0-9]*$|^\.?.[0-9]+$|[1-9]+[0-9]*$)$/gm
        if (value !== '' && value.match(pattern1)) {
            let floatValue = (value || '')
            onPercentageChange(`${floatValue}`, id, index)
        }
       // setCaretPosition(editRef.current, editRef.current.value.toString().length -1);  
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
        let updatedValue
        if (value === '') {
            if (initialValue.toString() === '0' || initialValue.toString() === '0.0' || initialValue.toString() === '0.00') {
                updatedValue = ''
            } else {
                updatedValue = `${initialValue}%`
            }
        } else {
            updatedValue = `${value}%`
        }
        setValue(updatedValue)
    }

    return (
        <div style={{ position: 'relative', marginTop: '20px' }} className='edit-pecentage'>
            <div className="currency-text" id={`currency-text-${id}`}>
                {labelText && <div className="label-holder-currency"><label>{labelText}</label></div>}

                <input type="text" placeholder={`${initialValue}%`} value={value} ref={editRef}
                    disabled={disabled || false} onFocus={onFocus}
                    onBlur={onBlur} style={{ display: disabled && isInputHide ? 'none' : 'block' }}
                    onChange={(e) => onChangeValue(e.target.value)} />


            </div>
            <div id={`currency-edit-disabled-${id}`} onClick={(e) => onCurencyExpand(e)}></div>
        </div>
    )
}

export default PercentageEditText