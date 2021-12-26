import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import RadioButton from '../atomiccomponent/RadioButton'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import '../sass/hoa.scss'
import CollapseDetails from './CollpaseDetails'

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
        name: 'Yes',
        value: 'Yes'
    }, {
        name: 'No',
        value: 'No'
    }]
    const [isExpand, setExpand] = useState(true)
    const [hoaInstruction, setHoaInstruction] = useState(instruction)
    const sellerPayDueHOAOptionsImages = ['/images/yes.png', '/images/no.png']
    const hoaOptionsImage = ['/images/no_hoa.png', '/images/hoa_monthly.png', '/images/hoa_quarterly.png', '/images/hoa_yearly.png']
    useEffect(() => {
        if (hoa?.HOAOptionsList?.length > 0) {
            const hoaDropDown = []
            hoa?.HOAOptionsList.forEach((hoa, index) => {

                let obj = {
                    ...hoa,
                    name: hoa.HOAOptionDescription,
                    value: hoa.HOAOptionId
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
        if (hoaOptionValue === '1') {
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
                    value.hoaValue === '1' && (<span>No HOA Due</span>)
                }
                {
                    value.hoaValue === '2' && (<span>HOA Due: {value.hoaAmount} per Month</span>)
                }
                {
                    value.hoaValue === '3' && (<span>HOA Due: {value.hoaAmount} per Quater</span>)
                }
                {
                    value.hoaValue === '4' && (<span>HOA Due: {value.hoaAmount} per Year</span>)
                }
            </>
        )
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
                                    images={hoaOptionsImage} />
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
                                    <div className="row hoa-pay-option">
                                        <div className="col-12">
                                            <p className="question-style">{selectedHOA?.newHOA?.HOAOptionDueDescription}</p>
                                            <RadioButton options={sellerPayDueHOAOptions} onRadioChanged={onHOASellerPayOptionsChange} id={'hoa-seller-paid-id'}
                                                images={sellerPayDueHOAOptionsImages} />
                                        </div>
                                    </div>
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