import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import DatePicker from '../atomiccomponent/DatePicker'
import RadioButton from '../atomiccomponent/RadioButton'
import { constantValues } from '../utils/constants'
import '../sass/salesprice.scss'
import CollapseDetails from './CollpaseDetails'
import { addCommaInNumber, getCurrencyValidationRegexPattern, getStingOnAPILanguage, getStingOnLanguage, isNextButton } from '../utils/utility'

const SalesPriceWithTransaction = ({ instruction, defaultValue, labelText, dateLabelText, dateDefaultValue, titleInsurance, purchaseType, onSalesPriceValue, onCollapseClick }) => {
    const [salesPriceInstruction, setSalesPriceInstruction] = useState(instruction)
    const titleInsurencePaidImages = ['images/DefaultForState.png', 'images/BuyerPays.png', 'images/5050split.png', 'images/SellerPays.png']
    const [isExpand, setExpand] = useState(true)
    const [insurencePaidOptions, setInsurencePaidOptions] = useState({
        desc: '',
        arr: []
    })
    const [purchaseTypeOptions, setPurchaseTypeOptions] = useState([])
    const [values, setValues] = useState({
        currency: defaultValue,
        date: dateDefaultValue,
        insuPaid: '',
        insuPaidOwner: '',
        transactionType: '',
        transactionTypeName: ''
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

    const onInsuPaidChange = (index, value, name) => {
        setValues({
            ...values,
            insuPaid: value,
            insuPaidOwner: name
        })
    }

    const onPurchaseTypeChange = (index, value, name) => {
        const titledropDownarr = []
        setValues({
            ...values,
            transactionType: value,
            transactionTypeName: name,
            insuPaid: ''
        })
        purchaseType[index]?.titleInsurance?.titleInsuranceOptionsList.forEach(insurance => {
            let obj = {
                ...insurance,
                name: getStingOnAPILanguage(insurance, 'titleInsuranceOptionDescription'),
                value: insurance.titleInsuranceOptionId,
                image: mapSalesPriceWithImages(insurance.titleInsuranceOptionId)
            }
            titledropDownarr.push(obj)
        })
        setInsurencePaidOptions({
            desc: getStingOnAPILanguage(purchaseType[index]?.titleInsurance, 'titleInsuranceLabel'),
            arr: titledropDownarr
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
                return 'images/Allcashoffer.png'
            case constantValues.BUYER_PURCHASE_TYPE_PURCHASE_WITH_FINANCE:
                return 'images/purchasewithfinance.png'
        }
    }
    useEffect(() => {
        if (purchaseType?.length > 0) {
            const purchaseTypeDownarr = []

            purchaseType?.forEach(purchaseType => {
                let obj = {
                    ...purchaseType,
                    name: getStingOnAPILanguage(purchaseType, 'transactionTypeDescription'),
                    value: purchaseType.transactionTypeId,
                    image: mapSalesPriceWithImages(purchaseType.transactionTypeId)
                }
                purchaseTypeDownarr.push(obj)

            })
            setPurchaseTypeOptions(purchaseTypeDownarr)

        }
    }, [JSON.stringify(purchaseType)])

    const enableClick = () => {
        const pattern = /^[1-9][0-9]*(\,[0-9]+)*(\.[0-9]+)?$/gm
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
                <span>{getStingOnLanguage('SALES_PRICE_SPAN')} ${addCommaInNumber(values.currency)}</span>
                <span>{getStingOnLanguage('CLOSING_DATE_SPAN')} {values.date}</span>
                <span>{getStingOnLanguage('TRANSACTION_TYPE_SPAN')} {values.transactionTypeName}</span>
                <span>{getStingOnLanguage('TITLE_POLICY_PAID_BY_SPAN')} {values.insuPaidOwner}</span>
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
        setInsurencePaidOptions({
            desc: '',
            arr: []
        })
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


                        <div className="row transaction-radio">
                            <div className="col-12">
                                <p className="question-style">{getStingOnLanguage('TRANSACTION_TYPE')}</p>
                                <RadioButton options={purchaseTypeOptions} onRadioChanged={onPurchaseTypeChange} id={'purchase-type-id'}
                                />
                            </div>
                        </div>
                        {
                            insurencePaidOptions?.arr?.length > 0 && (
                                <div className="row insu-radio">
                                    <div className="col-12">
                                        <p className="question-style">{insurencePaidOptions.desc}</p>
                                        <RadioButton options={insurencePaidOptions.arr} onRadioChanged={onInsuPaidChange} id={'insu-paid-id'}
                                            dafaultValue={values.insuPaid}
                                        />
                                    </div>
                                </div>
                            )
                        }
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