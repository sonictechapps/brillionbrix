import React, { useState } from 'react'
import '../sass/togglebutton.scss'
import CurrencyEditText from './CurrencyEditText'
import EditText from './EditText'

const ToggleButton = ({ isDescEdit, currencyPlaceHolder, currencyDefaultValue, id, descPlaceHolder, description, isChecked, setOtherExpenses }) => {
    const [value, setValue] = useState({
        checked: isChecked,
        currencyValue: currencyDefaultValue || '',
        descValue: ''
    })
    const onCurrencyChange = (currencyvalue) => {
        setValue({
            ...value,
            currencyValue: currencyvalue
        })
        setOtherExpenses({
            ...value,
            checked: !value.checked
        }, id)
    }

    const onChangeValue = (editvalue) => {
        setValue({
            ...value,
            descValue: editvalue
        })
        setOtherExpenses({
            ...value,
            checked: !value.checked
        }, id)
    }

    const onCheckBoxChange = (e) => {
        setValue({
            ...value,
            checked: !value.checked
        })
        setOtherExpenses({
            ...value,
            checked: !value.checked
        }, id)
    }

    return (
        <div className='toggle-button-container'>
            <div className='toggle-btn-desc'>
                <span>{description}</span>
            </div>
            <label className="switch">
                <input type="checkbox" onChange={(e) => onCheckBoxChange(e)} checked={value.hecked} />
                <span className="slider round"></span>
            </label>
            <div className={`toggle-edit ${isDescEdit && 'edit-desc'}`}>
                <CurrencyEditText placeholder={currencyPlaceHolder || ''} disabled={!value.checked} defaultValue={currencyDefaultValue} id={`currency-edit-${id}`} onCurrencyChange={onCurrencyChange} isReset={false} />
                {
                    isDescEdit && <EditText placeholder={descPlaceHolder || ''} id={`edit-${id}`} onChange={onChangeValue} disabled={!value.checked} />
                }

            </div>
        </div>
    )
}

export default ToggleButton