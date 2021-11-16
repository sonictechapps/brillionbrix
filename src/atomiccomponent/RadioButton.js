import React, { useState } from 'react'
import '../sass/radiobutton.scss'

const RadioButton = ({ options, name, dafaultValue, onRadioChanged }) => {
    console.log('dafaultValue', dafaultValue)
    const [value, setValue] = useState(dafaultValue)
    const onRadioChangeValue = (event) => {

        console.log('tuu', event.target.value)
    }
    const ontest = (index, e) => {
        console.log('index', index, e.target.value)
        setValue(e.target.value)
        onRadioChanged(index, e.target.value)
    }
    return (
        <div>
            {
                options.map((option, index) => (
                    <p>

                        <input type="radio" name={name} value={option.value} id={option.value} checked={value == option.value} onChange={(e) => ontest(index, e)} />
                        <label for={option.value}>{option.name}</label>
                    </p>
                ))

            }
            {/* <p>
                <input type="radio" id="test1" name="radio-group" value="apple" />
                <label for="test1">Apple</label>
            </p>
            <p>
                <input type="radio" id="test2" name="radio-group" value="peach" />
                <label for="test2">Peach</label>
            </p>
            <p>
                <input type="radio" id="test3" name="radio-group" value="orange" />
                <label for="test3">Orange</label>
            </p> */}
        </div>
    )
}

export default RadioButton