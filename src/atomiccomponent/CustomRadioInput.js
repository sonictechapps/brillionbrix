import React, { useRef, useState } from 'react'
import PercentageEditText from './PercentageEditText'
import CurrencyEditText from './CurrencyEditText'
import { getColor, getDefaultColor } from '../utils/utility'

const CustomRadioInput = ({ radioOptionList, id, index, option, value, onChange, onEditFieldChange, isInputHide, afterResetRadio }) => {
    const [isHover, setHover] = useState(false)
    const inputRef = useRef()
    const onMouseHover = () => {
        setHover(true)
    }

    const onMouseLeave = () => {
        setHover(false)
    }

    return (
        <>
            {
                value?.amount.length > 0 && (
                    <div className={`col-12 col-md-${12 / radioOptionList.length} radio-item radio-item-${id}-${index}`}
                    >
                        <input className={`customradio-input-${id}-${index}`} type="radio" value={option.value} id={option.value} checked={value.radioValue === option.value}
                            ref={inputRef} />
                        <label className={`customradio-label-${id}-${index}`} >

                            <img className={`customradio-img-${id}-${index}`} src={option.image}
                                onMouseEnter={(e) => onMouseHover(e, index)}
                                onMouseLeave={(e) => onMouseLeave(e, index)}
                                onClick={(e) => option.value !== value.radioValue && onChange(index, e)}
                                style={isHover ? { backgroundColor: getColor() } : value.radioValue === option.value ? { backgroundColor: getColor() } : { backgroundColor: getDefaultColor() }}
                            />
                            <div className='radio-desc' onClick={(e) => option.value !== value.radioValue && onChange(index, e)}>
                                <span>{option.desc}</span>
                            </div>
                            <div className='radio-input' onClick={(e) => option.value !== value.radioValue && onChange(index, e)}>
                                {
                                    option.isInput && option.isType === 'percentage' && <PercentageEditText placeholder="" defaultValue={value?.amount[index]?.value}
                                        id={id} onPercentageChange={onEditFieldChange} disabled={value?.radioValue != option?.value} isReset={value?.radioValue !== '' && value?.radioValue != option?.value} index={index}
                                        isInputHide={isInputHide} afterResetRadio={afterResetRadio} />
                                }
                                {
                                    option.isInput && option.isType === 'currency' && <CurrencyEditText placeholder="" defaultValue={value?.amount[index]?.value}
                                        id={id} onCurrencyChange={onEditFieldChange} disabled={value?.radioValue != option?.value} isReset={value?.radioValue !== '' && value?.radioValue != option?.value} index={index}
                                        isInputHide={isInputHide} afterResetRadio={afterResetRadio} />
                                }

                            </div>
                        </label>
                    </div>
                )
            }
        </>

    )
}

export default CustomRadioInput