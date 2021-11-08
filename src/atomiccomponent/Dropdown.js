import React from 'react'
import '../sass/dropdown.scss'

const Dropdown = ({ options, dropdoenId, selectText }) => {
    console.log('selectText', selectText)
    return (
        <select name={dropdoenId} id={dropdoenId}>
            {
                selectText && <option value="select">{selectText}</option>
            }
            {
                options.map((option, index) => (
                    <option value={option.value}>{option.name}</option>
                ))
            }
        </select>
    )
}

export default Dropdown
