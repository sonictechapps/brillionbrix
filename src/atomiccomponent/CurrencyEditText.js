import React, { useState, useRef, useEffect } from 'react'
import '../sass/currencyedittext.scss'
import { getColor } from '../utils/utility'
const CurrencyEditText = ({ type, placeholder, defaultValue, id, onCurrencyChange, labelText }) => {
    console.log('fff', defaultValue, ' ', labelText)
    const [value, setValue] = useState(`$${defaultValue}` || '')
    const editRef = useRef()
    const prevCountRef = useRef()
    const prevDefaultref = useRef(defaultValue)

    useEffect(() => {
        // console.log('test--->', prevDefaultref.current, ' ', defaultValue)
        // if (prevCountRef.current !== defaultValue) {
        //     setValue(defaultValue)
        // }
        // if (prevCountRef.current === '') {
        //     let length = editRef.current.value.split('.')[0].length
        //     console.log('startPos', editRef.current.selectionStart, ' ', length)
        //     setCaretToPos(editRef.current, length)
        // }
        // prevCountRef.current = value
        // prevDefaultref.current = defaultValue
        onChangeValue(value)
    }, [])

    // useEffect(()=> {
    //     setValue(defaultValue)
    // })

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
        let pattern = /(^\$|^\$([0-9]+\.?[0-9]*|\.?[0-9]+))$/gm
        console.log('value-->', value.match(pattern))
        if (value !== '' && value.match(pattern)) {
            console.log('pppp', value)
            let floatValue = (value.split('$')[1] || '')
            console.log('floatValue', floatValue)
            setValue(`$${floatValue}`)
            onCurrencyChange(`$${floatValue}`, id)
        }
        if (value === '') {
            setValue('$')
        }
    }

    const onCurrencyEditBlur = () => {
        const disabledDiv = document.querySelector(`#currency-edit-disabled-${id}`)
        disabledDiv.classList.add('disable-currency-edit')
        const outerCurrencyDiv = document.querySelector(`#currency-text-${id}`)
        outerCurrencyDiv.classList.add('currency-text-collapsed')
    }

    const onCurencyExpand = (e) => {
        const disabledDiv = document.querySelector(`#currency-edit-disabled-${id}`)
        disabledDiv.classList.remove('disable-currency-edit')
        const outerCurrencyDiv = document.querySelector(`#currency-text-${id}`)
        outerCurrencyDiv.classList.remove('currency-text-collapsed')
    }

    const onFocus = (e) => {
        console.log('hhh')
        e.target.style.borderColor = getColor()
    }

    const onBlur = (e) => {
        console.log('hhh')
        e.target.style.borderColor = '#ccc'
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