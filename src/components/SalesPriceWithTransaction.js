import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import DatePicker from '../atomiccomponent/DatePicker'
import RadioButton from '../atomiccomponent/RadioButton'
import { constantValues } from '../utils/constants'
import '../sass/salesprice.scss'
import CollapseDetails from './CollpaseDetails'
import { getStingOnLanguage, isNextButton } from '../utils/utility'

const SalesPriceWithTransaction = ({ instruction, defaultValue, labelText, dateLabelText, dateDefaultValue, titleInsurance, purchaseType, onSalesPriceValue, onCollapseClick }) => {
    const [salesPriceInstruction, setSalesPriceInstruction] = useState(instruction)
    const titleInsurencePaidImages = ['images/DefaultForState.png', 'images/BuyerPays.png', 'images/5050split.png', 'images/SellerPays.png']
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

    const mapSalesPriceWithImages = (id) => {
        switch ((id)) {
            case constantValues.BUYER_TITLE_INSURENCE_DEFAULT:
                return 'images/DefaultForState.png'
            case constantValues.BUYER_TITLE_INSURENCE_50_50:
                return 'images/5050split.png'
            case constantValues.BUYER_TITLE_INSURENCE_BUYER:
                return 'images/BuyerPays.png'
            case constantValues.BUYER_TITLE_INSURENCE_SELLER:
                return 'images/SellerPays.png'
            case constantValues.BUYER_PURCHASE_TYPE_CASH:
                return 'images/BuyerPays.png'
            case constantValues.BUYER_PURCHASE_TYPE_PURCHASE_WITH_FINANCE:
                return 'images/SellerPays.png'
        }
    }
    useEffect(() => {
        if (titleInsurance?.titleInsuranceOptionsList?.length > 0) {
            const titledropDownarr = []
            titleInsurance?.titleInsuranceOptionsList.forEach(insu => {
                let obj = {
                    ...insu,
                    name: insu.titleInsuranceOptionDescription,
                    value: insu.titleInsuranceOptionId,
                    image: mapSalesPriceWithImages(insu.titleInsuranceOptionId)
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
                    value: purchaseType.purchaseTypeOptionID,
                    image: mapSalesPriceWithImages(purchaseType.purchaseTypeOptionID)
                }
                purchaseTypeDownarr.push(obj)
            })
            setPurchaseTypeOptions(purchaseTypeDownarr)
        }
    }, [titleInsurance])

    const enableClick = () => {
        const pattern = /(^[1-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        console.log('kkk',values.currency, values.currency?.match(pattern), values.insuPaid !== '', values.date !== '', values.transactionType !== '' )
        return values && values.currency?.match(pattern) != null && values.insuPaid !== '' && values.date !== '' && values.transactionType !== ''

    }

    const onNextButtonClick = () => {
        setExpand(false)
        setSalesPriceInstruction()
        onSalesPriceValue(values)
    }

    const getHtmlContent = () => {
        return (
            <>
                <span>{getStingOnLanguage('SALES_PRICE_SPAN')} ${values.currency}</span>
                <span>{getStingOnLanguage('CLOSING_DATE_SPAN')} {values.date}</span>
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
                                <p className="question-style">{titleInsurance?.titleInsuranceLabel}</p>
                                <RadioButton options={insurencePaidOptions} onRadioChanged={onInsuPaidChange} id={'insu-paid-id'}
                                />
                            </div>
                        </div>

                        <div className="row transaction-radio">
                            <div className="col-12">
                                <p className="question-style">{getStingOnLanguage('TRANSACTION_TYPE')}</p>
                                <RadioButton options={purchaseTypeOptions} onRadioChanged={onPurchaseTypeChange} id={'purchase-type-id'}
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

export default SalesPriceWithTransaction