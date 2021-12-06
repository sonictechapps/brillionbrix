import React, { useState, useRef, useEffect } from 'react'
import '../sass/currencyedittext.scss'
import { editTextBorderColor, getColor } from '../utils/utility'
const CurrencyEditText = ({ type, placeholder, defaultValue, id, onCurrencyChange, labelText }) => {
    const [value, setValue] = useState(`$${defaultValue}` || '')
    const editRef = useRef()

    useEffect(() => {
        onChangeValue(value)
    }, [])

    function setSelectionRange(input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange) {
            let range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    const onChangeValue = (value) => {
        let pattern = /(^\$|^\$([0-9]+\.?[0-9]*|\.?[0-9]+))$/gm
        if (value !== '' && value.match(pattern)) {
            let floatValue = (value.split('$')[1] || '')
            setValue(`$${floatValue}`)
            onCurrencyChange(`$${floatValue}`, id)
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
        <div style={{ position: 'relative', marginTop: '20px' }}>
            <div className="currency-text" id={`currency-text-${id}`}>
                <div className="label-holder"><label>{labelText}</label></div>
                <input type="text" placeholder={placeholder} value={value} ref={editRef} onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={(e) => onChangeValue(e.target.value)} />
            </div>
            <div id={`currency-edit-disabled-${id}`} onClick={(e) => onCurencyExpand(e)}></div>
        </div>
    )
}

export default CurrencyEditText