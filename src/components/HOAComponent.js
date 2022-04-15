import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import RadioButton from '../atomiccomponent/RadioButton'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import '../sass/hoa.scss'
import CollapseDetails from './CollpaseDetails'
import { constantValues } from '../utils/constants'
import { getCurrencyValidationRegexPattern, getLanguage, getStingOnAPILanguage, getStingOnLanguage } from '../utils/utility'

const HOAComponent = ({ hoa, instruction, getHOADetails, onCollapseClick }) => {
    const [hoavalue, setHoaValue] = useState({
        hoaOptions: [],
    })
    const [value, setValue] = useState({
        hoaValue: '',
        hoaAmount: '',
        hoaSellerPaid: ''
    })
    const [selectedHOA, setSelectedHOA] = useState({
        newHOA: '',
        oldHOA: ''
    })
    const sellerPayDueHOAOptions = [{
        name: getStingOnLanguage('YES_HOA_DUE_VALUE'),
        value: constantValues.YES_HOA_DUE_ID,
        image: 'images/yes.png'

    }, {
        name: getStingOnLanguage('NO_HOA_DUE_VALUE'),
        value: constantValues.NO_HOA_DUE_ID,
        image: 'images/no.png'
    }]
    const [isExpand, setExpand] = useState(true)
    const [hoaInstruction, setHoaInstruction] = useState(instruction)
    const sellerPayDueHOAOptionsImages = ['images/yes.png', 'images/no.png']
    const hoaOptionsImage = ['images/no_hoa.png', 'images/hoa_monthly.png', 'images/hoa_quarterly.png', 'images/hoa_yearly.png']

    const mapHOAWithImages = (id) => {
        switch ((id)) {
            case constantValues.NO_HOA_ID:
                return 'images/no_hoa.png'
            case constantValues.MONTHLY_HOA_ID:
                return 'images/hoa_monthly.png'
            case constantValues.QUARTERLY_HOA_ID:
                return 'images/hoa_quarterly.png'
            case constantValues.ANUAL_HOA_ID:
                return 'images/hoa_yearly.png'
        }
    }

    useEffect(() => {
        if (hoa?.hoaOptionsList?.length > 0) {
            const hoaDropDown = []
            hoa?.hoaOptionsList.forEach((hoa, index) => {

                let obj = {
                    ...hoa,
                    name: getLanguage().toLowerCase() === 'es' ? hoa.hoaOptionDescription_es : hoa.hoaOptionDescription,
                    value: hoa.hoaOptionId,
                    image: mapHOAWithImages(hoa.hoaOptionId)
                }
                hoaDropDown.push(obj)
            })
            setHoaValue({
                hoaOptions: hoaDropDown
            })
        }
    }, [])

    const onHOAOptionsChange = (index, hoaOptionValue) => {
        console.log()
        setSelectedHOA({
            oldHOA: selectedHOA.newHOA,
            newHOA: hoavalue?.hoaOptions[index]
        })
        setValue({
            ...value,
            hoaAmount: hoa?.hoaOptionsList[index]?.hoaOptionAmountDefaultValue.toString(),
            hoaValue: hoaOptionValue,
            hoaSellerPaid: '',
            hoaIndex: index

        })
        if (hoaOptionValue == constantValues.NO_HOA_ID) {
            getHOADetails({
                ...value,
                hoaAmount: '',
                hoaValue: hoaOptionValue,
                hoaSellerPaid: ''
            })
            setExpand(false)
            setHoaInstruction()
        }
    }

    const onCurrencyChange = (currencyValue) => {
        setValue({
            ...value,
            hoaAmount: currencyValue,
        })
    }

    const onHOASellerPayOptionsChange = (index, hoaSellerValue) => {
        console.log('onHOASellerPayOptionsChange', index, hoaSellerValue)
        setValue({
            ...value,
            hoaSellerPaid: hoaSellerValue
        })
        if (value.hoaValue !== '' && !['', '0'].includes(value.hoaAmount)) {
            getHOADetails({
                ...value,
                hoaSellerPaid: hoaSellerValue,
                sellerPayDueHOAOptions,
                index: index
            })
            setExpand(false)
            setHoaInstruction()
        }

    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setValue({
                hoaValue: '',
                hoaAmount: '',
                hoaSellerPaid: ''
            })
            setHoaInstruction(ins)
        }, 'HOA')
    }

    const getHtmlContent = () => {
        return (
            <>
                {
                    value.hoaValue === constantValues.NO_HOA_ID.toString() && (<span>{getStingOnLanguage('NO_HOA_SPAN')}</span>)
                }
                {
                    value.hoaValue === constantValues.MONTHLY_HOA_ID.toString() && (<span>{getStingOnLanguage('HOA_DUE_SPAN')} ${value.hoaAmount} {getStingOnLanguage('PER_MONTH_SPAN')}</span>)
                }
                {
                    value.hoaValue === constantValues.QUARTERLY_HOA_ID.toString() && (<span>{getStingOnLanguage('HOA_DUE_SPAN')} ${value.hoaAmount} {getStingOnLanguage('PER_QUARTER_SPAN')}</span>)
                }
                {
                    value.hoaValue === constantValues.ANUAL_HOA_ID.toString() && (<span>{getStingOnLanguage('HOA_DUE_SPAN')} ${value.hoaAmount} {getStingOnLanguage('PER_YEAR_SPAN')}</span>)
                }
            </>
        )
    }

    const enableHOADue = () => {
        const pattern = getCurrencyValidationRegexPattern()
        return value?.hoaAmount.toString().match(pattern) !== null && !['', '0'].includes(value.hoaAmount)
    }
    return (
        <Card instruction={hoaInstruction}>

            {
                isExpand && (
                    <div className='hoa'>
                        <div className="row">
                            <div className="col-12">
                                <p className="question-style">{getStingOnAPILanguage(hoa, 'hoaPaymentDescription')}</p>
                                <RadioButton options={hoavalue?.hoaOptions} onRadioChanged={onHOAOptionsChange} id={'hoa-id'}
                                />
                            </div>
                        </div>
                        {
                            selectedHOA?.newHOA && selectedHOA?.newHOA?.hoaOptionId !== constantValues.NO_HOA_ID && (
                                <>
                                    <div className="row">
                                        <div className="col-12 hoa-currency-edit">
                                            <CurrencyEditText placeholder="" type="text"
                                                defaultValue={value.hoaAmount} id={'hoa-edit'}
                                                labelText={getStingOnAPILanguage(selectedHOA.newHOA, 'hoaOptionAmountLabel')} onCurrencyChange={onCurrencyChange} isReset={selectedHOA?.newHOA?.HOAOptionId !== selectedHOA?.oldHOA?.HOAOptionId} />
                                        </div>
                                    </div>
                                    {
                                        enableHOADue() && (
                                            <div className="row hoa-pay-option">
                                                <div className="col-12">
                                                    <p className="question-style">{getStingOnAPILanguage(selectedHOA?.newHOA, 'hoaOptionDueDescription')}</p>
                                                    <RadioButton options={sellerPayDueHOAOptions} onRadioChanged={onHOASellerPayOptionsChange} id={'hoa-seller-paid-id'}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }

                                </>
                            )
                        }
                    </div>
                )
            }

            {
                !isExpand && (
                    <div className="row">
                        <div className="col-12 dropDownCollapse-active">
                            <CollapseDetails htmlContent={getHtmlContent()} onEditClick={onCollpase} showEdit={true} />
                        </div>
                    </div>
                )
            }
        </Card>
    )
}

export default HOAComponent