import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import RadioButton from '../atomiccomponent/RadioButton'
import { constantValues } from '../utils/constants'

const TitlePolicyPaid = ({ instruction, transactionValue, setEnableButton }) => {
    const { salesPriceDescription, loanPriceDescription, titleInsurance, refiOption, refiCashOutAmountDesc } = transactionValue
    const [isExpand, setExpand] = useState(true)
    const [titlePolicyPaidInstruction, setTitlePolicyPaidInstruction] = useState(instruction)
    const titleInsurencePaidImages = ['/images/DefaultForState.png', '/images/BuyerPays.png', '/images/5050split.png', '/images/SellerPays.png']
    const refiOptionsImages = ['/images/0to4yearsloan.png', '/images/4to8yearsloan.png', '/images/Morethan8yearsoldloan.png']
    const [insurencePaidOptions, setInsurencePaidOptions] = useState([])
    const [values, setValues] = useState({
        titlePaidBy: {},
        refinace: {},
        salesPrice: '',
        loanPrice: '',
        mortgagePrice: ''
    })
    const [refiOptions, setRefiOptions] = useState([])
    const [isEnableState, setEnableState] = useState({
        titlePaidBy: false,
        refinace: false,
        salesPrice: false,
        loanPrice: false,
        mortgagePrice: false
    })
    useEffect(() => {
        if (transactionValue?.titleInsurance?.titleInsuranceOptionsList?.length > 0) {
            const titledropDownarr = []
            transactionValue?.titleInsurance?.titleInsuranceOptionsList.forEach(insu => {
                let obj = {
                    ...insu,
                    name: insu.titleInsuranceOptionDescription,
                    value: insu.titleInsuranceOptionId
                }
                titledropDownarr.push(obj)
            })
            setInsurencePaidOptions(titledropDownarr)
        }
        if (transactionValue?.refiOption) {
            const arr = []
            transactionValue.refiOption.forEach(refi => {
                const refiObj = {
                    ...refi,
                    name: refi.refinanceOptionsDesc,
                    value: refi.refinanceOptionId
                }
                arr.push(refiObj)
            })
            setRefiOptions(arr)
        }
        if (!transactionValue?.salesPriceDescription) {
            setEnableState({
                ...isEnableState,
                salesPrice: true
            })
        }
        if (!transactionValue?.loanPriceDescription) {
            setEnableState({
                ...isEnableState,
                loanPrice: true
            })
        }
        if (!transactionValue?.refiCashOutAmountDesc) {
            setEnableState({
                ...isEnableState,
                mortgagePrice: true
            })
        }
        if (!transactionValue?.titleInsurance?.titleInsuranceOptionsList) {
            setEnableState({
                ...isEnableState,
                titlePaidBy: true
            })
        }
        if (!transactionValue?.refiOption) {
            setEnableState({
                ...isEnableState,
                refinace: true
            })
        }
    }, [])

    const onInsurencePaidChange = (index, value) => {
        setValues({
            ...values,
            titlePaidBy: insurencePaidOptions[index]
        })
        setEnableButton(enableCalculateButton({
            ...values,
            titlePaidBy: insurencePaidOptions[index]
        }), {
            ...values,
            titlePaidBy: insurencePaidOptions[index]
        })
    }

    const onRefOptionsChanged = (index, value) => {
        setValues({
            ...values,
            refinace: refiOptions[index]
        })
        setEnableButton(enableCalculateButton({
            ...values,
            refinace: refiOptions[index]
        }), {
            ...values,
            refinace: refiOptions[index]
        })
    }

    const checkInputProperties = () => {
        const salesPriceDescription = transactionValue?.salesPriceDescription
        const loanPriceDescription = transactionValue?.loanPriceDescription
        const refiCashOutAmountDesc = transactionValue?.refiCashOutAmountDesc
        return ((salesPriceDescription && loanPriceDescription) || ((loanPriceDescription && refiCashOutAmountDesc)))
    }


    const onCurrencyChange = (value, id) => {
        switch (id) {
            case 'sales-price':
                setValues({
                    ...values,
                    salesPrice: value || transactionValue?.defaultSalesPrice
                })
                setEnableButton(enableCalculateButton({
                    ...values,
                    salesPrice: value || transactionValue?.defaultSalesPrice
                }), {
                    ...values,
                    salesPrice: value || transactionValue?.defaultSalesPrice
                })

                break
            case 'loan-price':
                setValues({
                    ...values,
                    loanPrice: value || transactionValue?.defaultLoanAmount
                })
                setEnableButton(enableCalculateButton({
                    ...values,
                    loanPrice: value || transactionValue?.defaultLoanAmount
                }), {
                    ...values,
                    loanPrice: value || transactionValue?.defaultLoanAmount
                })

                break
            case 'mortgage-price':
                setValues({
                    ...values,
                    mortgagePrice: value || transactionValue?.defaultRefiCashOutAmount
                })
                setEnableButton(enableCalculateButton({
                    ...values,
                    mortgagePrice: value || transactionValue?.defaultRefiCashOutAmount
                }), {
                    ...values,
                    mortgagePrice: value || transactionValue?.defaultRefiCashOutAmount
                })

                break
        }
    }

    const enableCalculateButton = (value) => {
        const pattern = /(^[1-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        if (salesPriceDescription && loanPriceDescription && titleInsurance) {
            return value.salesPrice?.match(pattern) !== null && value.loanPrice?.match(pattern) !== null && value.titlePaidBy?.titleInsuranceOptionId
        }

        else if (salesPriceDescription && titleInsurance) {
            return value.salesPrice?.match(pattern) !== null && value.titlePaidBy?.titleInsuranceOptionId
        }
        else if (loanPriceDescription && refiOption && refiCashOutAmountDesc) {
            return value.mortgagePrice?.match(pattern) !== null && value.refinace?.refinanceOptionId && value.loanPrice?.match(pattern) !== null
        }

        else if (loanPriceDescription && refiOption) {
            return value.loanPrice?.match(pattern) !== null && value.refinace?.refinanceOptionId
        }
        
    }

    return (
        <Card instruction={titlePolicyPaidInstruction}>
            {
                isExpand && (
                    <>
                        {
                            transactionValue?.titleInsurance && (
                                <div className="row">
                                    <div className="col-12" className='title-insurence-active'>
                                        <p className="question-style">{transactionValue?.titleInsurance?.titleInsuranceLabel}</p>
                                        <RadioButton options={insurencePaidOptions} onRadioChanged={onInsurencePaidChange}
                                            id={'insu-paid-id'} dafaultValue={values?.titlePaidBy?.titleInsuranceOptionId}
                                            images={titleInsurencePaidImages} />
                                    </div>

                                </div>
                            )
                        }
                        {
                            refiOptions.length > 0 && (
                                <div className="row">
                                    <div className="col-12" className='refinance-type-active'>
                                        <p className="question-style">{constantValues.REFINANCE_LABEL}</p>
                                        <RadioButton options={refiOptions} onRadioChanged={onRefOptionsChanged} id={'ref-id'}
                                            images={refiOptionsImages} dafaultValue={values?.refinace?.refinanceOptionId} />
                                    </div>
                                </div>
                            )
                        }
                        <div className={`${checkInputProperties() ?
                            'amount-input-container-all' : 'amount-input-container'}`}>
                            {
                                (transactionValue && transactionValue?.salesPriceDescription) && (

                                    <div>
                                        <CurrencyEditText placeholder="Enter property sales price" type="text"
                                            defaultValue={transactionValue.defaultSalesPrice} id={'sales-price'}
                                            onCurrencyChange={onCurrencyChange} labelText={transactionValue.salesPriceDescription} />
                                    </div>
                                )
                            }
                            {
                                (transactionValue && transactionValue?.loanPriceDescription) && (
                                    <div>

                                        <CurrencyEditText placeholder="Enter amount of new loan" type="text"
                                            defaultValue={transactionValue.defaultLoanAmount} id={'loan-price'}
                                            labelText={transactionValue.loanPriceDescription} onCurrencyChange={onCurrencyChange} />

                                    </div>
                                )
                            }
                            {
                                transactionValue?.refiCashOutAmountDesc && (
                                    <div>
                                        <CurrencyEditText placeholder="Enter mortgage principal amount" type="text"
                                            defaultValue={transactionValue.defaultRefiCashOutAmount} id={'mortgage-price'}
                                            labelText={transactionValue.refiCashOutAmountDesc} onCurrencyChange={onCurrencyChange} />
                                    </div>
                                )
                            }
                        </div>
                    </>
                )
            }

        </Card>
    )
}

export default React.memo(TitlePolicyPaid)