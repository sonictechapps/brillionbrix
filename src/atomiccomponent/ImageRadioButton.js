import React from 'react'

const ImageRadioButton = () => {
    return (
        <div>
            <input type="radio" name="emotion" value={option.value} id={option.value} checked={value == option.value} onChange={(e) => ontest(index, e)} />
            <label for={option.value}>
                <img
                    src="//placekitten.com/150/150"
                    alt="I'm sad" />
            </label>

            <input type="radio" name={name} value={option.value} id={option.value} checked={value == option.value} onChange={(e) => ontest(index, e)} />
            <label for={option.value}>
                <img
                    src="//placekitten.com/150/150"
                    alt="I'm sad" />
            </label>
        </div>
    )
}

export default ImageRadioButton