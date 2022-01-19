import React, { useEffect, useRef, useState } from 'react'
import '../sass/radiobutton.scss'
import RadioInput from './RadioInput'

const RadioButton = ({ options, name, dafaultValue, onRadioChanged, id, isReset, afterResetRadio }) => {
    const [value, setValue] = useState(dafaultValue)
  
    useEffect(() => {
        setValue(dafaultValue)
    }, [dafaultValue])
    
    useEffect(() => {
       setValue(dafaultValue)
       afterResetRadio && afterResetRadio()
    }, [isReset])

    const onChange = (index, e) => {
        setValue(options[index]?.value)
        onRadioChanged(index, e.target.value, options[index].name)

    }

    return (
        <div className="row radio-container">

            <div className={`row radio-container-inner`}>
                {
                    options.map((option, index) => (
                        <RadioInput option={option} options={options} onChange={onChange} value={value} index={index} id={id}
                            name={name} />
                    ))
                }
            </div>
        </div>
    )
}

export default React.memo(RadioButton)