import React, { useRef, useState } from 'react'
import PercentageEditText from './PercentageEditText'
import CurrencyEditText from './CurrencyEditText'
import { getColor, getDefaultColor } from '../utils/utility'

const CustomRadioInput = ({ radioOptionList, id, index, option, image, value, onChange, onEditFieldChange }) => {
    console.log('vvalue-->', value, option)
    const [isHover, setHover] = useState(false)
    const inputRef = useRef()
    const onMouseHover = () => {
        setHover(true)
    }

    const onMouseLeave = () => {
        setHover(false)
    }
    return (
        <div className={`col-12 col-md-${12 / radioOptionList.length} radio-item radio-item-${id}-${index}`}
        >
            <input className={`customradio-input-${id}-${index}`} type="radio" value={option.value} id={option.value} checked={value.radioValue === option.value}
                ref={inputRef} />
            <label className={`customradio-label-${id}-${index}`} onClick={(e) => onChange(index, e)}>

                <img className={`customradio-img-${id}-${index}`} src={image}
                    onMouseEnter={(e) => onMouseHover(e, index)}
                    onMouseLeave={(e) => onMouseLeave(e, index)}
                    style={isHover ? { backgroundColor: getColor() } : inputRef.current?.checked ? { backgroundColor: getColor() } : { backgroundColor: getDefaultColor() }}
                />
                <div className='radio-desc'>
                    <span>{option.desc}</span>
                </div>

                <div className='radio-input'>
                    {
                        option.isInput && option.isType === 'percentage' && <PercentageEditText placeholder="" defaultValue={option.defaultValue}
                            id={id} onPercentageChange={onEditFieldChange} disabled={value?.radioValue !== option?.value} isReset={value?.radioValue !== option?.value} index={index} />
                    }
                    {
                        option.isInput && option.isType === 'currency' && <CurrencyEditText placeholder="" defaultValue={option.defaultValue}
                            id={id} onCurrencyChange={onEditFieldChange} disabled={value?.radioValue !== option?.value} isReset={value?.radioValue !== option?.value} index={index} />
                    }

                </div>
            </label>
        </div>
    )
}

export default CustomRadioInput