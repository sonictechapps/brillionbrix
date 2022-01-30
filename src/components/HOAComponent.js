import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import RadioButton from '../atomiccomponent/RadioButton'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import '../sass/hoa.scss'
import CollapseDetails from './CollpaseDetails'
import { constantValues } from '../utils/constants'

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
        name: constantValues.YES_HOA_DUE_VALUE,
        value: constantValues.YES_HOA_DUE_ID,
        image: 'images/yes.png'

    }, {
        name: constantValues.NO_HOA_DUE_VALUE,
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
        if (hoa?.HOAOptionsList?.length > 0) {
            const hoaDropDown = []
            hoa?.HOAOptionsList.forEach((hoa, index) => {

                let obj = {
                    ...hoa,
                    name: hoa.HOAOptionDescription,
                    value: hoa.HOAOptionId,
                    image: mapHOAWithImages(hoa.HOAOptionId)
                }
                hoaDropDown.push(obj)
            })
            setHoaValue({
                hoaOptions: hoaDropDown
            })
        }
    }, [])

    const onHOAOptionsChange = (index, hoaOptionValue) => {
        setSelectedHOA({
            oldHOA: selectedHOA.newHOA,
            newHOA: hoavalue?.hoaOptions[index]
        })
        setValue({
            ...value,
            hoaAmount: '',
            hoaValue: hoaOptionValue,
            hoaSellerPaid: ''

        })
        if (hoaOptionValue === constantValues.NO_HOA_ID) {
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
        setValue({
            ...value,
            hoaSellerPaid: hoaSellerValue
        })
        if (value.hoaValue !== '' && !['', '0'].includes(value.hoaAmount)) {
            getHOADetails({
                ...value,
                hoaSellerPaid: hoaSellerValue
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
                    value.hoaValue === constantValues.NO_HOA_ID && (<span>{constantValues.NO_HOA_SPAN}</span>)
                }
                {
                    value.hoaValue === constantValues.MONTHLY_HOA_ID && (<span>{constantValues.HOA_DUE_SPAN} ${value.hoaAmount} {constantValues.PER_MONTH_SPAN}</span>)
                }
                {
                    value.hoaValue === constantValues.QUARTERLY_HOA_ID && (<span>{constantValues.HOA_DUE_SPAN} ${value.hoaAmount} {constantValues.PER_QUARTER_SPAN}</span>)
                }
                {
                    value.hoaValue === constantValues.ANUAL_HOA_ID && (<span>{constantValues.HOA_DUE_SPAN} ${value.hoaAmount} {constantValues.PER_YEAR_SPAN}</span>)
                }
            </>
        )
    }

    const enableHOADue = () => {
        const pattern = /(^[1-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        return value?.hoaAmount?.match(pattern) !== null && !['', '0'].includes(value.hoaAmount)
    }
    return (
        <Card instruction={hoaInstruction}>

            {
                isExpand && (
                    <div className='hoa'>
                        <div className="row">
                            <div className="col-12">
                                <p className="question-style">{hoa?.HOAPaymentDescription}</p>
                                <RadioButton options={hoavalue?.hoaOptions} onRadioChanged={onHOAOptionsChange} id={'hoa-id'}
                                />
                            </div>
                        </div>
                        {
                            selectedHOA?.newHOA && selectedHOA?.newHOA?.HOAOptionAmountDefaultValue && (
                                <>
                                    <div className="row">
                                        <div className="col-12 hoa-currency-edit">
                                            <CurrencyEditText placeholder="" type="text"
                                                defaultValue={selectedHOA.newHOA.HOAOptionAmountDefaultValue} id={'hoa-edit'}
                                                labelText={selectedHOA.newHOA.HOAOptionAmountLabel} onCurrencyChange={onCurrencyChange} isReset={selectedHOA?.newHOA?.HOAOptionId !== selectedHOA?.oldHOA?.HOAOptionId} />
                                        </div>
                                    </div>
                                    {
                                        enableHOADue() && (
                                            <div className="row hoa-pay-option">
                                                <div className="col-12">
                                                    <p className="question-style">{selectedHOA?.newHOA?.HOAOptionDueDescription}</p>
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
                        <div className="col-12" className='dropDownCollapse-active'>
                            <CollapseDetails htmlContent={getHtmlContent()} onEditClick={onCollpase} />
                        </div>
                    </div>
                )
            }
        </Card>
    )
}

export default HOAComponent