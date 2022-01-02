import React, { useEffect, useState } from 'react'
import '../sass/togglebutton.scss'
import CurrencyEditText from './CurrencyEditText'
import EditText from './EditText'

const ToggleButton = ({ isDescEdit, currencyPlaceHolder, currencyDefaultValue, id, descPlaceHolder, description, isChecked, setExpenses }) => {
    const [value, setValue] = useState({
        checked: isChecked,
        currencyValue: currencyDefaultValue || '',
        descValue: ''
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
        setExpenses({
            ...value,
            currencyValue: currencyvalue
        }, id)
    }

    const onChangeValue = (editvalue) => {
        setValue({
            ...value,
            descValue: editvalue
        })
        setExpenses({
            ...value,
            descValue: editvalue
        }, id)
    }

    const onCheckBoxChange = (e) => {
        console.log('onCheckBoxChange', e.target.checked)
        setValue({
            ...value,
            currencyValue: !e.target.checked ? currencyDefaultValue : value.currencyValue,
            checked: !value.checked
        })
        setExpenses({
            ...value,
            currencyValue: !e.target.checked ? currencyDefaultValue : value.currencyValue,
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
                <span className="slider round"></span>
            </label>
            <div className={`toggle-edit ${isDescEdit && 'edit-desc'}`}>
                <CurrencyEditText placeholder={currencyPlaceHolder || ''} disabled={!value.checked} defaultValue={value.currencyValue} id={`currency-edit-${id}`} onCurrencyChange={onCurrencyChange} isReset={!value.checked} />
                {
                    isDescEdit && <EditText placeholder={descPlaceHolder || ''} id={`edit-${id}`} onChange={onChangeValue} disabled={!value.checked} />
                }

            </div>
        </div>
    )
}

export default ToggleButton