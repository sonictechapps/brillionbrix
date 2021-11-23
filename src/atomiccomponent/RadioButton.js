import React, { useState } from 'react'
import '../sass/radiobutton.scss'

const RadioButton = ({ options, name, dafaultValue, onRadioChanged, images }) => {
    console.log('dafaultValue', dafaultValue, options)
    const [value, setValue] = useState(dafaultValue)
    // const onRadioChangeValue = (event) => {

    //     console.log('tuu', event.target.value)
    // }
    const onChange = (index, e) => {
        console.log('index', index, e.target.value)
        setValue(e.target.value)
        const transactionRadio = document.querySelector('.radio-container')
        transactionRadio.classList.add('radio-container-collapse')
        const radioDisabled = document.querySelector('.radio-disabled')
        radioDisabled.classList.add('radio-container-disabled')
        onRadioChanged(index, e.target.value)
    }

    const onRadioDisabledClicked = () => {
        const radioDisabled = document.querySelector('.radio-disabled')
        radioDisabled.classList.remove('radio-container-disabled')
        const transactionRadio = document.querySelector('.radio-container')
        transactionRadio.classList.remove('radio-container-collapse')
        
    }

    return (
        <div className="row radio-container">
            <div>
                {
                    options.map((option, index) => (
                        <div className="radio-options-div">
                            <label>
                                <input type="radio" name={name} value={option.value} id={option.value} onChange={(e) => onChange(index, e)} checked={value == option.value} />
                                <img src={images[index]} />
                            </label>
                            <p>{option.name}</p>
                        </div>
                    ))
                }
            </div>
            <div className="radio-disabled" onClick={onRadioDisabledClicked}>

            </div>
        </div>
    )
}

export default RadioButton