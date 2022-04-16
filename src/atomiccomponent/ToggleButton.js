import React, { useEffect, useState } from 'react'
import '../sass/togglebutton.scss'
import { getColor } from '../utils/utility'
import CurrencyEditText from './CurrencyEditText'
import EditText from './EditText'

const ToggleButton = ({ isDescEdit, currencyPlaceHolder, currencyDefaultValue, id, descPlaceHolder, description, isChecked, setExpenses, descValue }) => {
    const [value, setValue] = useState({
        checked: isChecked,
        currencyValue: currencyDefaultValue || '',
        descValue: descValue || '',
        currencyDesc: description
    })
    useEffect(()=> {
        setExpenses({
            ...value,
        }, id)
    },[])
    const onCurrencyChange = (currencyvalue) => {
        setValue({
            ...value,
            currencyValue: currencyvalue
        })
        // setExpenses({
        //     ...value,
        //     currencyValue: currencyvalue
        // }, id)
    }

    const onChangeValue = (editvalue) => {
        setValue({
            ...value,
            descValue: editvalue
        })
        // setExpenses({
        //     ...value,
        //     descValue: editvalue
        // }, id)
    }

    const onEditBlur = () => {
        setExpenses({
            ...value
        }, id)
    }

    const onCurrencyBlur = () => {
        setExpenses({
            ...value
        }, id)
    }

    const onCheckBoxChange = (e) => {
        setValue({
            ...value,
            currencyValue: !e.target.checked ? currencyDefaultValue : value.currencyValue,
            checked: !value.checked
        })
        setExpenses({
            ...value,
            currencyValue: !e.target.checked ? currencyDefaultValue : value.currencyValue,
            descValue: !e.target.checked ? descValue: value.descValue,
            checked: !value.checked
        }, id)
    }

    return (
        <div className='toggle-button-container'>
            <div className='toggle-btn-desc'>
                <span>{description}</span>
            </div>
            <label className="switch">
                <input type="checkbox" onChange={(e) => onCheckBoxChange(e)} checked={value.checked} />
                <span className="slider round" style={{ backgroundColor: value.checked ? getColor() : '' }}></span>
            </label>
            <div className={`toggle-edit ${isDescEdit && 'edit-desc'}`}>
                <CurrencyEditText placeholder={currencyPlaceHolder || ''} disabled={!value.checked} defaultValue={value.currencyValue} id={`currency-edit-${id}`} onCurrencyChange={onCurrencyChange} isReset={!value.checked} 
                onCurrencyBlur={onCurrencyBlur} />
                {
                    isDescEdit && <EditText placeholder={descPlaceHolder || ''} id={`edit-${id}`} onChange={onChangeValue} disabled={!value.checked} onBlur={onEditBlur} defaultValue={descValue}
                     />
                }

            </div>
        </div>
    )
}

export default ToggleButton