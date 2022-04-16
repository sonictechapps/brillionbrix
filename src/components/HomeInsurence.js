import React, { useState } from 'react'
import Card from '../atomiccomponent/Card'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import '../sass/homeinsurence.scss'
import { constantValues } from '../utils/constants'
import { getCurrencyValidationRegexPattern, getStingOnLanguage, isNextButton } from '../utils/utility'
import CollapseDetails from './CollpaseDetails'

const HomeInsurence = ({ instruction, homeInsurance, onHIValue, onCollapseClick }) => {
    const [homeInsurenceInstruction, setHomeInsurenceInstruction] = useState(instruction)
    const [hiValue, setHIValue] = useState(homeInsurance?.homeinsurancevalue)
    const [isExpand, setExpand] = useState(true)

    const onEditFieldChange = (value, id, index) => {
        setHIValue(value)
    }

    const onNextButtonClick = () => {
        setExpand(false)
        setHomeInsurenceInstruction()
        onHIValue(hiValue)
    }

    const getHomeInsurenceValue = () => {
        const pattern = getCurrencyValidationRegexPattern()
        return (!['', '0'].includes(hiValue) && hiValue?.match(pattern) !== null)
    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setHIValue(homeInsurance?.homeinsurancevalue)
            setHomeInsurenceInstruction(ins)
        }, 'HomeInsurence')
    }

    const getHtmlContent = () => {
        return (
            <span>Home Insurence Cost: ${hiValue}</span>
        )
    }

    return (
        <Card instruction={homeInsurenceInstruction}>
            {
                isExpand && (
                    <>
                        <div className='home-insurence-container'>
                            <CurrencyEditText placeholder="" defaultValue={hiValue} labelText={homeInsurance?.homeInsuranceDescription}
                                id='home-insurence' onCurrencyChange={onEditFieldChange} />
                        </div>
                        {
                            getHomeInsurenceValue() && (
                                <div className="row sales-next-btn">
                                    <div className="col-12">
                                        <p>{getStingOnLanguage('HOME_INSURENCE_TEXT')} {isNextButton(onNextButtonClick)}</p>
                                    </div>
                                </div>
                            )
                        }
                    </>
                )
            }


            {
                !isExpand && (
                    <div className="row">
                        <div className="col-12 dropDownCollapse-active">
                            <CollapseDetails htmlContent={getHtmlContent()} onEditClick={onCollpase} />
                        </div>
                    </div>
                )
            }
        </Card>
    )
}

export default HomeInsurence