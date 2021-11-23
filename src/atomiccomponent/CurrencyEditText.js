import React, { useState, useRef, useEffect } from 'react'
import '../sass/currencyedittext.scss'

const CurrencyEditText = ({ type, placeholder, defaultValue, id, onCurrencyChange, labelText }) => {
    console.log('fff',defaultValue, ' ',labelText)
    const [value, setValue] = useState(defaultValue || '')
    const editRef = useRef()
    const prevCountRef = useRef()

    useEffect(() => {
        if (prevCountRef.current === '') {
            let length = editRef.current.value.split('.')[0].length
            console.log('startPos', editRef.current.selectionStart, ' ', length)
            setCaretToPos(editRef.current, length)
        }
        prevCountRef.current = value
        onChangeValue(value)
    }, [value])

    function setSelectionRange(input, selectionStart, selectionEnd) {
        console.log('input', input.setSelectionRange)
        if (input.setSelectionRange) {
            console.log('aa')
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange) {
            console.log('bb')
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    function setCaretToPos(input, pos) {
        setSelectionRange(input, pos, pos);
    }

    const onChangeValue = (value) => {
        console.log('value-->', value)
        if (value !== '') {
            console.log('pppp')
            let floatValue = parseFloat(value.split('$')[1] || value).toFixed(2)
            setValue(`$${floatValue}`)
            onCurrencyChange(`$${floatValue}`,id)
        } else {
            setValue('')
        }
    }

    const onCurrencyEditBlur = () => {
        const disabledDiv = document.querySelector(`#currency-edit-disabled-${id}`)
        disabledDiv.classList.add('disable-currency-edit')
        const outerCurrencyDiv = document.querySelector(`#currency-text-${id}`)
        outerCurrencyDiv.classList.add('currency-text-collapsed')
    }

    const onCurencyExpand =(e) => {
        const disabledDiv = document.querySelector(`#currency-edit-disabled-${id}`)
        disabledDiv.classList.remove('disable-currency-edit')
        const outerCurrencyDiv = document.querySelector(`#currency-text-${id}`)
        outerCurrencyDiv.classList.remove('currency-text-collapsed')
    }
    return (
        <div style={{ position: 'relative', marginTop: '20px' }}>
            <div className="currency-text" id={`currency-text-${id}`}>
                <div className="label-holder"><label>{labelText}</label></div>
                <input type={type} placeholder={placeholder} value={value} ref={editRef}
                    onChange={(e) => onChangeValue(e.target.value)} onBlur={onCurrencyEditBlur} />
            </div>
            <div id={`currency-edit-disabled-${id}`}onClick={(e)=> onCurencyExpand(e)}></div>
        </div>
    )
}

export default CurrencyEditText