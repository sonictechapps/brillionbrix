import React, { useEffect, useState } from 'react'
import '../sass/radiobutton.scss'
import { getColor } from '../utils/utility'

const RadioButton = ({ options, name, dafaultValue, onRadioChanged, images, id }) => {
    console.log('dafaultValue', dafaultValue, options)
    const [value, setValue] = useState(dafaultValue)
    // const onRadioChangeValue = (event) => {

    //     console.log('tuu', event.target.value)
    // }
    useEffect(() => {
        setValue(dafaultValue)
    }, [dafaultValue])
    const onChange = (index, e) => {
        console.log('index', index, e.target)
        // const iValue = e.target.querySelectorAll('input')[0].value
        setValue(options[index]?.value)
        // const transactionRadio = document.querySelector('.radio-container')
        // transactionRadio.classList.add('radio-container-collapse')
        // const radioDisabled = document.querySelector('.radio-disabled')
        // radioDisabled.classList.add('radio-container-disabled')
        onRadioChanged(index, e.target.value)
        console.log('klll', e.target)
        const radiolabel = e.target?.querySelector(`.radio-label-${id}-${index}`)
        console.log('89119', radiolabel)
        // const radioInput = radiolabel?.querySelector(`.radio-input-${id}-${index}`)
        const radioImage = radiolabel?.querySelector(`.radio-img-${id}-${index}`)
        console.log('89119112', document.body.getElementsByTagName('input'))
        for (let input of document.body.getElementsByTagName('input')) {
            if (input.nextElementSibling ) {
                input.nextElementSibling.style.backgroundColor = input.checked? getColor() : 'white'
              //  radioImage.style.backgroundColor = getColor()
            }
            
        }

    }

    // const onRadioDisabledClicked = () => {
    //     const radioDisabled = document.querySelector('.radio-disabled')
    //     radioDisabled.classList.remove('radio-container-disabled')
    //     const transactionRadio = document.querySelector('.radio-container')
    //     transactionRadio.classList.remove('radio-container-collapse')

    // }

    const onMouseHover = (e, index) => {
        console.log('klll', e.target)
        const radiolabel = e.target?.querySelector(`.radio-label-${id}-${index}`)
        console.log('89119', radiolabel)
        const radioImage = radiolabel?.querySelector(`.radio-img-${id}-${index}`)
        console.log('8911911', radioImage)
        if (radioImage) radioImage.style.backgroundColor = getColor()
    }

    const onMouseLeave = (e, index) => {
        console.log('klll', e.target)
        const radiolabel = e.target?.querySelector(`.radio-label-${id}-${index}`)
        console.log('89119', radiolabel)
        const radioImage = radiolabel?.querySelector(`.radio-img-${id}-${index}`)
        const radioInput = radiolabel?.querySelector(`.radio-input-${id}-${index}`)
        console.log('8911911', radioImage)
        if (radioImage && !radioInput.checked) radioImage.style.backgroundColor = 'white'
    }

    const onClick = (e, index) => {

    }


    return (
        <div className="row radio-container">
            <div className={`row radio-container-inner`}>
                {
                    options.map((option, index) => (
                        <div className={`radio-options-div col-12 col-md-${12 / options.length}`} onClick={(e) => onChange(index, e)} onMouseEnter={(e) => onMouseHover(e, index)}
                            onMouseLeave={(e) => onMouseLeave(e, index)}>
                            <label className={`radio-label-${id}-${index}`}>
                                <input className={`radio-input-${id}-${index}`} type="radio" name={name} value={option.value} id={option.value} checked={value == option.value} />
                                <img className={`radio-img-${id}-${index}`} src={images[index]} />
                            </label>
                            <div>
                                <p>{option.name}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            {/* <div className="radio-disabled" onClick={onRadioDisabledClicked}>

            </div> */}
        </div>
    )
}

export default RadioButton