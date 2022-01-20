import React from 'react'
import { getColor } from '../utils/utility'

const ToggleButtonWithLabel = ({ endorseMent, handleChange }) => {
    return (
        <div className="box-switch" style={{ boxShadow: `0 2px 5px 0 ${getColor()}, 0 2px 10px 0 ${getColor()}` }}>
            <label className='endorsedesc'> $ {endorseMent.endorsementDescription} {endorseMent.endorsementFee} </label>
            <div className='switch-container'>
                <label className="switch">
                    <input type="checkbox" checked={endorseMent.defaultEnabled} onChange={() => handleChange(endorseMent)} />
                    <span className="slider round" style={{ backgroundColor: endorseMent.defaultEnabled ? getColor() : '' }}></span>
                </label>
            </div>
        </div>
    )
}

export default ToggleButtonWithLabel