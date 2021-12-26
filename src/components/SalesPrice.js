import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import DatePicker from '../atomiccomponent/DatePicker'
import RadioButton from '../atomiccomponent/RadioButton'
import { constantValues } from '../utils/constants'
import '../sass/salesprice.scss'
import CollapseDetails from './CollpaseDetails'

const SalesPrice = ({ defaultValue, labelText, instruction, dateDefaultValue, dateLabelText, titleInsurance, onSalesPriceValue, onCollapseClick }) => {

    const titleInsurencePaidImages = ['/images/DefaultForState.png', '/images/BuyerPays.png', '/images/5050split.png', '/images/SellerPays.png']
    const [insurencePaidOptions, setInsurencePaidOptions] = useState([])
    const [values, setValues] = useState({
        currency: defaultValue,
        date: dateDefaultValue,
        insuPaid: ''
    })
    const onCurrencyChange = (value) => {
        setValues({
            ...values,
            currency: value
        })
    }
    const [isExpand, setExpand] = useState(true)
    const [salesPriceInstruction, setSalesPriceInstruction] = useState(instruction)
    const onInsuPaidChange = (index, value) => {
        setValues({
            ...values,
            insuPaid: value
        })
    }
    useEffect(() => {
        if (titleInsurance?.titleInsuranceOptionsList?.length > 0) {
            const titledropDownarr = []
            titleInsurance?.titleInsuranceOptionsList.forEach(insu => {
                let obj = {
                    ...insu,
                    name: insu.titleInsuranceOptionDescription,
                    value: insu.titleInsuranceOptionId
                }
                titledropDownarr.push(obj)
            })
            setInsurencePaidOptions(titledropDownarr)
        }
    }, [titleInsurance])

    const onDateChange = (value) => {
        setValues({
            ...values,
            date: value
        })
    }

    const onNextButtonClick = () => {
        setExpand(false)
        setSalesPriceInstruction()
        onSalesPriceValue(values)
    }

    const getHtmlContent = () => {
        return (
            <>
                <span>Sale Price: ${values.currency}</span>
                <span>Closing Date: {values.date}</span>
            </>
        )
    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setValues({
                currency: defaultValue,
                date: dateDefaultValue,
                insuPaid: ''
            })
            setSalesPriceInstruction(ins)
        }, 'Sales Price')
    }

    return (
        <Card instruction={salesPriceInstruction}>
            {
                isExpand && (
                    <>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <CurrencyEditText placeholder="Enter property sales price" type="text"
                                    defaultValue={defaultValue} id={'sales-price'}
                                    labelText={labelText} onCurrencyChange={onCurrencyChange} />
                            </div>
                            <div className="col-12 col-md-6">
                                <DatePicker labelText={dateLabelText} defaultValue={dateDefaultValue} id={'sales-closing-date'}
                                    onDateChange={onDateChange} />
                            </div>
                        </div>
                        <div className="row insu-radio">
                            <div className="col-12">
                                <p className="question-style">{titleInsurance?.titleInsuranceLabel}</p>
                                <RadioButton options={insurencePaidOptions} onRadioChanged={onInsuPaidChange} id={'insu-paid-id'}
                                    images={titleInsurencePaidImages} />
                            </div>
                        </div>
                        {
                            values && !['0', ''].includes(values?.currency) && values.insuPaid !== '' && values.date !== '' && (
                                <div className="row sales-next-btn">
                                    <div className="col-12">
                                        <p>If you're done entering your sales price and closing date, <span onClick={onNextButtonClick}>Click here</span></p>
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
                        <div className="col-12" className='dropDownCollapse-active'>
                            <CollapseDetails htmlContent={getHtmlContent()} onEditClick={onCollpase} />
                        </div>
                    </div>
                )
            }

        </Card>
    )
}

export default SalesPrice