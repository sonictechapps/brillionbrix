import React, { useEffect, useState } from 'react'
import '../sass/customradioutton.scss'
import CustomRadioInput from './CustomRadioInput'

const CustomeRadioButton = ({ radioOptionList, id, description, getCustomRadioButtonValue, isReset, isInputHide, defaultValue }) => {
    const initialAmountValue = radioOptionList?.map(option => {
        return {
            value: option.defaultValue,
            id: option.value
        }
    })
    const [value, setValue] = useState({
        radioValue: '',
        amount: initialAmountValue
    })

    useEffect(() => {
        if (initialAmountValue.length > 0) {
            setValue({
                radioValue: defaultValue || '',
                amount: initialAmountValue
            })
        }
            
    }, [JSON.stringify(initialAmountValue), isReset])

    const onChange = (index, e) => {
        setValue({
            ...value,
            index: index,
            radioValue: radioOptionList[index]?.value,
        })
        getCustomRadioButtonValue(
            {
                radioValue: radioOptionList[index]?.value,
                amount: initialAmountValue,
                index: index
            }, radioOptionList[index]?.desc
        )

    }

    const onEditFieldChange = (editValue, id, index) => {
        value.amount[index] = {
            value: editValue,
            id: radioOptionList[index].value
        }
        setValue({
            ...value,
            amount: value.amount
        })
        getCustomRadioButtonValue({
            ...value,
            amount: value.amount
        })
    }

    const afterResetRadioInput = (index, defaultValue) => {
        value.amount[index] = {
            value: defaultValue,
            id: radioOptionList[index].value
        }
        setValue({
            ...value,
            amount: value.amount
        })
    }

    return (
        <div className="row custom-radio-container">
            <p className="question-style">{description}</p>
            {
               radioOptionList.length > 0 &&  radioOptionList?.map((option, index) => (
                    <CustomRadioInput radioOptionList={radioOptionList} id={id} index={index} option={option} value={value} onChange={onChange}
                        onEditFieldChange={onEditFieldChange} isInputHide={isInputHide} afterResetRadio={afterResetRadioInput}defaultValue = {defaultValue}/>
                ))
            }
        </div>
    )
}

export default React.memo(CustomeRadioButton)