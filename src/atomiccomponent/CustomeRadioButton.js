import React, { useEffect, useState } from 'react'
import '../sass/customradioutton.scss'
import { getColor } from '../utils/utility'
import CustomRadioInput from './CustomRadioInput'

const CustomeRadioButton = ({ radioOptionList, imageList, id, description, getCustomRadioButtonValue }) => {
    console.log('radioOptionList', radioOptionList)
    const initialAmountValue = radioOptionList?.map(option => option.defaultValue)
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
            }
        )
        // onRadioChanged(index, e.target.value)

    }

    useEffect(() => {

    }, [value])

    const onEditFieldChange = (editValue, id, index) => {
        console.log('indexxxxxxxx', editValue)
        value.amount[index] = editValue
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
            <label>{description}</label>
            {
                radioOptionList?.map((option, index) => (
                    <CustomRadioInput radioOptionList={radioOptionList} id={id} index={index} option={option} image={imageList[index]} value={value} onChange={onChange}
                        onEditFieldChange={onEditFieldChange} />
                ))
            }
        </div>
    )
}

export default React.memo(CustomeRadioButton)