import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import DatePicker from '../atomiccomponent/DatePicker'
import RadioButton from '../atomiccomponent/RadioButton'
import { constantValues } from '../utils/constants'
import '../sass/salesprice.scss'
import CollapseDetails from './CollpaseDetails'
import { getStingOnLanguage, isNextButton, getLanguage, getStingOnAPILanguage } from '../utils/utility'

const SalesPrice = ({ defaultValue, labelText, instruction, dateDefaultValue, dateLabelText, titleInsurance, onSalesPriceValue, onCollapseClick }) => {

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
            insuPaid: value,
            index: index
        })
    }

    const mapSalesPriceWithImages = (id) => {
        switch ((id)) {
            case constantValues.TITLE_INSURENCE_DEFAULT:
                return 'images/DefaultForState.png'
            case constantValues.TITLE_INSURENCE_50_50:
                return 'images/5050split.png'
            case constantValues.TITLE_INSURENCE_BUYER:
                return 'images/BuyerPays.png'
            case constantValues.TITLE_INSURENCE_SELLER:
                return 'images/SellerPays.png'
        }
    }
    useEffect(() => {
        if (titleInsurance?.titleInsuranceOptionsList?.length > 0) {
            const titledropDownarr = []
            titleInsurance?.titleInsuranceOptionsList.forEach(insu => {
                let obj = {
                    ...insu,
                    name: getLanguage().toLowerCase() === 'es' ? insu.titleInsuranceOptionDescription_es : insu.titleInsuranceOptionDescription,
                    value: insu.titleInsuranceOptionId,
                    image: mapSalesPriceWithImages(insu.titleInsuranceOptionId)
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

    const addCommaInNumber = (number) => {

        const nonDecimal = number.split('.')[0].split('')
        const decimal = number.split('.')[1]
        let i = 0
        for (let j = nonDecimal.length - 1; j >= 0; j--) {
            if (i % 3 === 0 && (j !== nonDecimal.length - 1)) {
                nonDecimal[j] = nonDecimal[j] + ','
            }
            i++
        }
        return decimal !== undefined ? `${nonDecimal.join('')}.${decimal}` : nonDecimal.join('')
    }

    const getHtmlContent = () => {
        return (
            <>
                <span>{getStingOnLanguage('SALES_PRICE_SPAN')} ${addCommaInNumber(values.currency)}</span>
                <span>{getStingOnLanguage('CLOSING_DATE_SPAN')} {values.date}</span>
                <span>{getStingOnLanguage('TITLE_POLICY_PAID_BY_SPAN')} {insurencePaidOptions[values.index].name}</span>
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

    const enableClick = () => {
        const pattern = /^[1-9][0-9]*(\,[0-9]+)*(\.[0-9]+)?$/gm
        return values && values.currency?.match(pattern) != null && values.insuPaid !== '' && values.date !== ''

    }

    return (
        <Card instruction={salesPriceInstruction}>
            {
                isExpand && (
                    <>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <CurrencyEditText placeholder="Enter property sales price" type="text"
                                    defaultValue={values.currency} id={'sales-price'}
                                    labelText={labelText} onCurrencyChange={onCurrencyChange} />
                            </div>
                            <div className="col-12 col-md-6">
                                <DatePicker labelText={dateLabelText} defaultValue={dateDefaultValue} id={'sales-closing-date'}
                                    onDateChange={onDateChange} />
                            </div>
                        </div>
                        <div className="row insu-radio">
                            <div className="col-12">
                                <p className="question-style">{ getStingOnAPILanguage(titleInsurance,'titleInsuranceLabel')}</p>
                                <RadioButton options={insurencePaidOptions} onRadioChanged={onInsuPaidChange} id={'insu-paid-id'}
                                />
                            </div>
                        </div>
                        {
                            enableClick() && (
                                <div className="row sales-next-btn">
                                    <div className="col-12">
                                        <p>{getStingOnLanguage('SALE_PRICE_NEXT_TEXT')} {isNextButton(onNextButtonClick)}</p>
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
                            <CollapseDetails htmlContent={getHtmlContent()} onEditClick={onCollpase} showEdit={true} />
                        </div>
                    </div>
                )
            }

        </Card>
    )
}

export default SalesPrice