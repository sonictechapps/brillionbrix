import React, { useEffect, useState } from 'react'
import '../sass/customradioutton.scss'
import { getColor } from '../utils/utility'
import CustomRadioInput from './CustomRadioInput'

const CustomeRadioButton = ({ radioOptionList, id, description, getCustomRadioButtonValue, isReset, afterResetRadio, isInputHide }) => {
    console.log('radioOptionList', radioOptionList)
    const initialAmountValue = radioOptionList?.map(option => {
        return {
            value: option.defaultValue,
            id: option.value
        }
    })
    console.log('initialAmountValue', initialAmountValue)
    const [value, setValue] = useState({
        radioValue: '',
        amount: initialAmountValue
    })
    const onMouseHover = (e, index) => {
        e.stopPropagation()
        // const radiolabel = e.target
        // const radioImage = radiolabel?.querySelector(`.customradio-img-${id}-${index}`)
        // if (radioImage) radioImage.style.backgroundColor = getColor()
        e.target.style.backgroundColor = getColor()
    }

    const onMouseLeave = (e, index) => {
        e.stopPropagation()
        // const radiolabel = e.target
        // const radioImage = radiolabel?.querySelector(`.customradio-img-${id}-${index}`)
        const radioInput = document.querySelector(`.customradio-input-${id}-${index}`)
        console.log('/////////////////', radioInput?.checked)
        if (!radioInput?.checked) e.target.style.backgroundColor = 'white'
    }

    const onCurrencyChange = (value) => {
        console.log('nmmmmmmmmmmmmm', value)
    }

    const onChange = (index, e) => {
        console.log('888888888888888888', radioOptionList[index]?.value)
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
        // onRadioChanged(index, e.target.value)

    }

    useEffect(() => {
        setValue({
            radioValue: '',
            amount: initialAmountValue
        })
        afterResetRadio && afterResetRadio()
    }, [isReset])

    const onEditFieldChange = (editValue, id, index) => {
        console.log('indexxxxxxxx', editValue)
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