import React from 'react'
import CurrencyEditText from './CurrencyEditText'
import PercentageEditText from './PercentageEditText'
import '../sass/textwithfield.scss'

const TextWithEditField = ({ labelvalue, defaultValue, type, id, onEditFieldChange, isDisabled, isReset, afterResetRadio }) => {
    return (
        <div className='text-with-field'>
            <p>{labelvalue}</p>
            <div>
                {
                    type === 'percentage' && <PercentageEditText placeholder="" defaultValue={defaultValue}
                        id={id} onPercentageChange={onEditFieldChange} disabled={isDisabled} isReset={isReset} afterResetRadio={afterResetRadio} />
                }
                {
                    type === 'currency' && <CurrencyEditText placeholder="" defaultValue={defaultValue}
                        id={id} onCurrencyChange={onEditFieldChange} disabled={isDisabled} isReset={isReset} afterResetRadio={afterResetRadio} />
                }
            </div>
        </div>
    )
}

export default TextWithEditField