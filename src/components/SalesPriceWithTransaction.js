import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import DatePicker from '../atomiccomponent/DatePicker'
import RadioButton from '../atomiccomponent/RadioButton'
import { constantValues } from '../utils/constants'
import '../sass/salesprice.scss'
import CollapseDetails from './CollpaseDetails'
import { isNextButton } from '../utils/utility'

const SalesPriceWithTransaction = ({ instruction, defaultValue, labelText, dateLabelText, dateDefaultValue, titleInsurance, purchaseType, onSalesPriceValue, onCollapseClick }) => {
    const [salesPriceInstruction, setSalesPriceInstruction] = useState(instruction)
    const titleInsurencePaidImages = ['/images/DefaultForState.png', '/images/BuyerPays.png', '/images/5050split.png', '/images/SellerPays.png']
    const [isExpand, setExpand] = useState(true)
    const [insurencePaidOptions, setInsurencePaidOptions] = useState([])
    const [purchaseTypeOptions, setPurchaseTypeOptions] = useState([])
    const [values, setValues] = useState({
        currency: defaultValue,
        date: dateDefaultValue,
        insuPaid: '',
        transactionType: ''
    })

    const onCurrencyChange = (value) => {
        setValues({
            ...values,
            currency: value
        })
    }

    const onDateChange = (value) => {
        setValues({
            ...values,
            date: value
        })
    }

    const onInsuPaidChange = (index, value) => {
        setValues({
            ...values,
            insuPaid: value
        })
    }

    const onPurchaseTypeChange = (index, value) => {
        setValues({
            ...values,
            transactionType: value
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

        if (purchaseType?.purchaseTypeOptionList?.length > 0) {
            const purchaseTypeDownarr = []
            purchaseType?.purchaseTypeOptionList.forEach(purchaseType => {
                let obj = {
                    ...purchaseType,
                    name: purchaseType.purchaseTypeOptionDescription,
                    value: purchaseType.purchaseTypeOptionID
                }
                purchaseTypeDownarr.push(obj)
            })
            setPurchaseTypeOptions(purchaseTypeDownarr)
        }
    }, [titleInsurance])

    const enableClick = () => {
        const pattern = /(^[1-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        return values && values.currency?.match(pattern) !== null && values.insuPaid !== '' && values.date !== '' && values.transactionType !== ''

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
                insuPaid: '',
                transactionType: ''
            })
            setSalesPriceInstruction(ins)
        }, 'Sales Price')
    }

    return (
        <Card instruction={salesPriceInstruction}>
            {console.log('purchase tpe', purchaseTypeOptions)}
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

                        <div className="row transaction-radio">
                            <div className="col-12">
                                <p className="question-style">{constantValues.TRANSACTION_TYPE}</p>
                                <RadioButton options={purchaseTypeOptions} onRadioChanged={onPurchaseTypeChange} id={'purchase-type-id'}
                                    images={titleInsurencePaidImages} />
                            </div>
                        </div>
                        {
                            enableClick() && (
                                <div className="row sales-next-btn">
                                    <div className="col-12">
                                        <p>{constantValues.SALE_PRICE_NEXT_TEXT} {isNextButton(onNextButtonClick)}</p>
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

export default SalesPriceWithTransaction