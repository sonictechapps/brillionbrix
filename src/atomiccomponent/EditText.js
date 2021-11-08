import React, { useState, useRef, useEffect } from 'react'
import '../sass/edittext.scss'

const EditText = ({ type, placeholder }) => {
    const [value, setValue] = useState('')
    const editRef = useRef()
    const prevCountRef = useRef()

    useEffect(() => {
        if (prevCountRef.current === '') {
            let length = editRef.current.value.split('.')[0].length
            console.log('startPos', editRef.current.selectionStart, ' ', length)
            setCaretToPos(editRef.current, length)
        }
        prevCountRef.current = value;
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
        } else {
            setValue('')
        }
    }
    return (
        <input type="text" placeholder={placeholder} value={value} ref={editRef} onChange={(e) => onChangeValue(e.target.value)} style={{width:'70%'}}/>
    )
}

export default EditText