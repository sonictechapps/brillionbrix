import React, { useEffect, useState } from 'react'
import '../sass/radiobutton.scss'
import { getColor } from '../utils/utility'

const RadioButton = ({ options, name, dafaultValue, onRadioChanged, images, id }) => {
    const [value, setValue] = useState(dafaultValue)
    useEffect(() => {
        setValue(dafaultValue)
    }, [dafaultValue])

    const onChange = (index, e) => {
        setValue(options[index]?.value)
        onRadioChanged(index, e.target.value)
        for (let input of document.body.getElementsByTagName('input')) {
            if (input.nextElementSibling ) {
                input.nextElementSibling.style.backgroundColor = input.checked? getColor() : 'white'
            }
            
        }

    }

    const onMouseHover = (e, index) => {
        const radiolabel = e.target?.querySelector(`.radio-label-${id}-${index}`)
        const radioImage = radiolabel?.querySelector(`.radio-img-${id}-${index}`)
        if (radioImage) radioImage.style.backgroundColor = getColor()
    }

    const onMouseLeave = (e, index) => {
        const radiolabel = e.target?.querySelector(`.radio-label-${id}-${index}`)
        const radioImage = radiolabel?.querySelector(`.radio-img-${id}-${index}`)
        const radioInput = radiolabel?.querySelector(`.radio-input-${id}-${index}`)
        if (radioImage && !radioInput.checked) radioImage.style.backgroundColor = 'white'
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
        </div>
    )
}

export default RadioButton