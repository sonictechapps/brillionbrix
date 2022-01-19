import React, { useEffect, useState } from 'react'
import '../sass/customradioutton.scss'
import CustomRadioInput from './CustomRadioInput'

const CustomeRadioButton = ({ radioOptionList, id, description, getCustomRadioButtonValue, isReset, afterResetRadio, isInputHide }) => {
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

    const onChange = (index, e) => {
        setValue({

            radioValue: radioOptionList[index]?.value,
            amount: initialAmountValue
        })
        getCustomRadioButtonValue(
            {
                radioValue: radioOptionList[index]?.value,
                amount: initialAmountValue
            }, radioOptionList[index]?.desc
        )

    }

    useEffect(() => {
        setValue({
            radioValue: '',
            amount: initialAmountValue
        })
        afterResetRadio && afterResetRadio()
    }, [isReset])

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

    return (
        <div className="row custom-radio-container">
            <p className="question-style">{description}</p>
            {
                radioOptionList?.map((option, index) => (
                    <CustomRadioInput radioOptionList={radioOptionList} id={id} index={index} option={option} value={value} onChange={onChange}
                        onEditFieldChange={onEditFieldChange} isInputHide={isInputHide} />
                ))
            }
        </div>
    )
}

export default React.memo(CustomeRadioButton)