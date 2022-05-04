import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CustomeRadioButton from '../atomiccomponent/CustomeRadioButton'
import RadioButton from '../atomiccomponent/RadioButton'
import TextWithEditField from '../atomiccomponent/TextWithEditField'
import { constantValues } from '../utils/constants'
import '../sass/loantype.scss'
import CollapseDetails from './CollpaseDetails'
import { addCommaInNumber, getCurrencyValidationRegexPattern, getStingOnAPILanguage, getStingOnLanguage, isNextButton } from '../utils/utility'

const LoanType = ({ instruction, loanType, salesprice, onCollapseClick, onLoanTypeValue }) => {
    const [loanInstruction, setLoanInstruction] = useState(instruction)
    const [loanTypeOptions, setLoanTypeOptions] = useState([])
    const [loanDetailsOptions, setLoanDetailsOptions] = useState()
    const [isExpand, setExpand] = useState(true)
    const [mIPPMIVisible, setMIPPMIVisible] = useState(false)
    const [isReset, setReset] = useState(false)
    const [isMIPReset, setMIPReset] = useState(false)
    const [updatedLoanType, setUpdatedLoanType] = useState(loanType)
    //let loanValue, loanTermValue, fundingfeeValue, downPaymentValue, mipValue
    const initialValue = {
        loantype: '',
        loanValue: '',
        loanterm: '',
        downpaymentid: '',
        downpaymentamount: '',
        fundingfee: '',
        mipinsurence: '',
        interestrate: '',
        pmirate: '',
        miprate: '',
        loantypeindex: -1

    }
    const [loanTypeValue, setLoanTypeValue] = useState(initialValue)
    const loanTypeImages = ['images/DefaultForState.png', 'images/BuyerPays.png', 'images/5050split.png']
    const loanTermImages = ['images/DefaultForState.png', 'images/BuyerPays.png', 'images/5050split.png']
    const loanFundImages = ['images/DefaultForState.png', 'images/BuyerPays.png', 'images/5050split.png']
    const loanFinanceImages = ['images/DefaultForState.png', 'images/BuyerPays.png']

    const mapLoanTypeeWithImages = (id) => {
        switch ((id)) {
            case constantValues.LOAN_TYPE_CONVENTIONAL_ID:
                return 'images/DefaultForState.png'
            case constantValues.LOAN_TYPE_VA_ID:
                return 'images/BuyerPays.png'
            case constantValues.LOAN_TYPE_FHA_ID:
                return 'images/5050split.png'
        }
    }

    const mapLoanTermWithImages = (id) => {
        switch ((id)) {
            case constantValues.LOAN_TERM_30_YEARS_ID:
                return 'images/DefaultForState.png'
            case constantValues.LOAN_TERM_15_YEARS_ID:
                return 'images/BuyerPays.png'
            case constantValues.LOAN_TERM_20_YEARS_ID:
                return 'images/5050split.png'
        }
    }

    const mapLoanDownPaymentWithImages = (id) => {
        switch ((id)) {
            case constantValues.LOAN_STANDARD_20_PERCENTAGE_ID:
                return 'images/DefaultForState.png'
            case constantValues.LOAN_CUSTOM_PERCENTAGE_ID:
                return 'images/BuyerPays.png'
            case constantValues.LOAN_CUSTOM_AMOUNT_ID:
                return 'images/5050split.png'
        }
    }

    const maploanTypeOptionVAFundingFeeImages = (id) => {
        switch ((id)) {
            case constantValues.LOAN_VA_FUND_YES:
                return 'images/DefaultForState.png'
            case constantValues.LOAN_VA_FUND_NO:
                return 'images/BuyerPays.png'
            case constantValues.LOAN_VA_FUND_NA:
                return 'images/5050split.png'
        }
    }

    const maploanTypeOptionFHAMIPImages = (id) => {
        switch ((id)) {
            case constantValues.LOAN_MIP_FINANCE_YES:
                return 'images/DefaultForState.png'
            case constantValues.LOAN_MIP_FINANCE_NO:
                return 'images/BuyerPays.png'
        }
    }


    const onLoanTypeChange = (index, value, name) => {
        // setLoanTypeValue({
        //     ...initialValue,
        //     loantype: value,
        //     loanValue: name,

        // })
        getLoanDetsils(loanTypeOptions[index], index)

        setReset(true)
    }

    useEffect(() => {
        if (loanType?.loanTypeOptionList?.length > 0) {
            const loanTypedropDownarr = []
            loanType?.loanTypeOptionList.forEach(loan => {
                let obj = {
                    ...loan,
                    name: getStingOnAPILanguage(loan, 'loanTypeOptionDescription'),
                    value: loan.loanTypeOptionId,
                    image: mapLoanTypeeWithImages(loan.loanTypeOptionId)
                }
                loanTypedropDownarr.push(obj)
            })
            setLoanTypeOptions(loanTypedropDownarr)
            getLoanDetsils(loanTypedropDownarr[0], 0)

        }
        setUpdatedLoanType(loanType)
    }, [JSON.stringify(updatedLoanType)])

    const onLoanTermChange = (index, value, name) => {
        setLoanTypeValue({
            ...loanTypeValue,
            loanterm: value?.toString() || '',
            loantermvalue: name
        })
    }

    const onFundingFeeChange = (index, value, name) => {
        setLoanTypeValue({
            ...loanTypeValue,
            fundingfee: value?.toString(),
            fundingfeevalue: name
        })
    }

    const onMIPFinanceChange = (index, value, name) => {
        setLoanTypeValue({
            ...loanTypeValue,
            mipinsurence: value.toString(),
            mipinsurencevalue: name
        })
    }

    const getLoanDetsils = (loanType, index) => {
        setReset(true)
        setMIPPMIVisible(false)
        const loanTermArr = []
        const loanDownpaymentArr = []
        const fundArr = []
        const financeArr = []
        loanType?.loanTypeOptionTermList.forEach(loanType => {
            let value = {
                name: loanType.loanTypeOptionTermDescription,
                value: loanType.loanTypeOptionTermId,
                image: mapLoanTermWithImages(loanType.loanTypeOptionTermId)
            }
            loanTermArr.push(value)
        })
        loanType?.loanTypeOptionDownPaymentList.forEach(downPayment => {
            let value = {
                desc: downPayment.loanTypeOptionDownPaymentDescription,
                value: downPayment.loanTypeOptionDownPaymentId,
                defaultValue: downPayment.loanTypeOptionDownPaymentDefaultValue,
                isInput: downPayment.loanTypeOptionDownPaymentId === constantValues.LOAN_STANDARD_20_PERCENTAGE_ID ? false : true,
                isType: downPayment.loanTypeOptionDownPaymentId === constantValues.LOAN_CUSTOM_PERCENTAGE_ID ? 'percentage' : 'currency',
                image: mapLoanDownPaymentWithImages(downPayment.loanTypeOptionDownPaymentId)
            }
            loanDownpaymentArr.push(value)
        })
        loanType?.loanTypeOptionVAFundingFeeValueList?.forEach(fund => {
            let value = {
                name: fund.loantypeOptionFeeValue,
                value: fund.loantypeOptionFeeId,
                image: maploanTypeOptionVAFundingFeeImages(fund.loantypeOptionFeeId)
            }
            fundArr.push(value)
        })
        loanType?.loanTypeOptionIsMIPFinanceList?.forEach(finance => {
            let value = {
                name: finance.loantypeOptionFeeValue,
                value: finance.loantypeOptionFeeId,
                image: maploanTypeOptionFHAMIPImages(finance.loantypeOptionFeeId)
            }
            financeArr.push(value)
        })
        let obj = {
            ...loanType,
            loanTerm: loanTermArr,
            loanDownPayment: loanDownpaymentArr,
            fund: fundArr,
            finance: financeArr
        }

        setLoanDetailsOptions(obj)
        setLoanTypeValue({
            ...initialValue,
            loantypeindex: index,
            loantype: loanType.loanTypeOptionId.toString(),
            loanValue: getStingOnAPILanguage(loanType, 'loanTypeOptionDescription'),
            interestrate: loanType?.loanTypeOptionInterestRateDefaultValue.toString() || '',
            pmirate: loanType?.loanTypeOptionPMIDefaultValue.toString() || '',
            miprate: loanType?.loanTypeOptionMIPDefaultValue.toString() || ''
        })
    }

    const getCustomRadioButtonDownPaymentValue = (value, name) => {
        setMIPReset(false)
        const pattern = getCurrencyValidationRegexPattern()
        const selectedValueForPercentage = parseInt(value?.amount?.find(v => v.id === constantValues.LOAN_CUSTOM_PERCENTAGE_ID).value)
        const selectedValueForAmount = (parseInt(value?.amount?.find(v => v.id === constantValues.LOAN_CUSTOM_AMOUNT_ID).value) / salesprice) * 100
        if ((value.radioValue === constantValues.LOAN_CUSTOM_PERCENTAGE_ID && selectedValueForPercentage > 0 && selectedValueForPercentage < 20 && value?.amount?.find(v => v.id === constantValues.LOAN_CUSTOM_PERCENTAGE_ID).value.match(pattern) !== null)
            || (value.radioValue === constantValues.LOAN_CUSTOM_AMOUNT_ID && selectedValueForAmount > 0 && selectedValueForAmount < 20 && value?.amount?.find(v => v.id === constantValues.LOAN_CUSTOM_AMOUNT_ID).value.match(pattern) !== null)) {
                setMIPPMIVisible(true)
            setMIPReset(true)
        } else {
            setMIPPMIVisible(false)
        }

        let amount = ''
        switch (value.radioValue) {
            case constantValues.LOAN_STANDARD_20_PERCENTAGE_ID:
                amount = value.amount[0].value
                break;
            case constantValues.LOAN_CUSTOM_PERCENTAGE_ID:
                amount = value.amount[1].value
                break;
            case constantValues.LOAN_CUSTOM_AMOUNT_ID:
                amount = value.amount[2].value
                break;
            default:
                break;
        }
        setLoanTypeValue({
            ...loanTypeValue,
            downpaymentid: value.radioValue.toString(),
            downpaymentamount: amount.toString(),
            downpaymentvalue: name,
            interestrate: loanTypeOptions[loanTypeValue.loantypeindex].loanTypeOptionInterestRateDefaultValue.toString() || '',
            pmirate: loanTypeOptions[loanTypeValue.loantypeindex].loanTypeOptionPMIDefaultValue.toString() || '',
            miprate: loanTypeOptions[loanTypeValue.loantypeindex].loanTypeOptionMIPDefaultValue.toString() || ''
        })
        setReset(false)
    }

    const onEditFieldChange = (value, id, index) => {
        switch (id) {
            case 'interest-rate':
                loanTypeValue['interestrate'] = value.toString()
                break
            case 'pmi-rate':
                loanTypeValue['pmirate'] = value.toString()
                break
            case 'mip-rate':
                loanTypeValue['miprate'] = value.toString()
                break
            default:
                break
        }
        setLoanTypeValue({
            ...loanTypeValue
        })
    }



    const getLoanTypeValue = () => {
        const pattern = getCurrencyValidationRegexPattern()
        switch (parseInt(loanTypeValue.loantype)) {
            case constantValues.LOAN_TYPE_CONVENTIONAL_ID:
                const conventional = ['loantype', 'loanterm', 'downpaymentid', 'downpaymentamount', 'interestrate', 'pmirate']
                return conventional.every(item => {
                    return !['', '0'].includes(loanTypeValue[item].toString()) && loanTypeValue[item].toString()?.match(pattern) !== null
                })
            case constantValues.LOAN_TYPE_VA_ID:
                const va = ['loantype', 'loanterm', 'downpaymentid', 'downpaymentamount', 'interestrate', 'fundingfee']
                return va.every(item => !['', '0'].includes(loanTypeValue[item]) && loanTypeValue[item].toString()?.match(pattern) !== null)
            case constantValues.LOAN_TYPE_FHA_ID:
                const fha = ['loantype', 'loanterm', 'downpaymentid', 'downpaymentamount', 'interestrate', 'miprate', 'mipinsurence']
                return fha.every(item => !['', '0'].includes(loanTypeValue[item].toString()) && loanTypeValue[item].toString()?.match(pattern) !== null)
            default:
                break;
        }
    }

    const onNextButtonClick = () => {
        setExpand(false)
        setLoanInstruction()
        onLoanTypeValue(loanTypeValue)
    }

    const afterResetRadio = () => {
        setReset(false)
    }

    const getHtmlContent = () => {
        return (
            <>
                <span>{getStingOnLanguage('LOAN_TYPE_SPAN')} {getStingOnAPILanguage(loanTypeValue, 'loanValue')}</span>
                <span>{getStingOnLanguage('LOAN_TERM_SPAN')} {getStingOnAPILanguage(loanTypeValue, 'loantermvalue')}</span>
                {/* <span>{${loanTypeValue.loantype === '1' ? }}: {`${loanTypeValue.loantype === '3' ? '$' : ''}${loanTypeValue.downpaymentvalue}${loanTypeValue.loantype !== '3' ? '%' : ''}`}</span> */}
                {
                    (loanTypeValue.downpaymentid === constantValues.LOAN_STANDARD_20_PERCENTAGE_ID.toString() ||
                    loanTypeValue.downpaymentid === constantValues.LOAN_CUSTOM_PERCENTAGE_ID.toString()) ?
                    <span>{`${getStingOnLanguage('DOWN_PAYMENT_RATE_SPAN')}: ${loanTypeValue.downpaymentamount}%`}</span>
                    : 
                    <span>{`${getStingOnLanguage('DOWN_PAYMENT_AMOUNT_SPAN')}: $${addCommaInNumber(loanTypeValue.downpaymentamount)}`}</span>
                }
                <span>{getStingOnLanguage('INTEREST_RATE_SPAN')} {loanTypeValue.interestrate}%</span>
                {
                    loanDetailsOptions?.loanTypeOptionMIPDescription && mIPPMIVisible &&
                    <span>{getStingOnLanguage('MIP_RATE_SPAN')} {loanTypeValue.miprate}%</span>
                }
                {
                    loanDetailsOptions?.loanTypeOptionPMIDescription && mIPPMIVisible &&
                    <span>{getStingOnLanguage('PMI_RATE_SPAN')} {loanTypeValue.pmirate}%</span>
                }
                {
                    loanDetailsOptions?.finance?.length > 0 && mIPPMIVisible &&
                    <span>{getStingOnLanguage('MIP_FINANACE_SPAN')} {loanTypeValue.mipinsurencevalue}</span>
                }
                {
                    loanDetailsOptions?.fund?.length > 0 &&
                    <span>{getStingOnLanguage('VA_FUNDING_SPAN')} {loanTypeValue.fundingfeevalue}</span>
                }
            </>
        )
    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setLoanTypeValue(initialValue)
            setUpdatedLoanType()
            setLoanInstruction(ins)
            setLoanTypeOptions([])
            setLoanDetailsOptions()
        }, 'LoanType')
        
    }

    return (
        <Card instruction={loanInstruction}>
            {
                isExpand && (
                    <>
                        <div className="row loan-type">
                            <div className="col-12">
                                <p className="question-style">{getStingOnLanguage('LOAN_TYPE')}</p>
                                <RadioButton options={loanTypeOptions} onRadioChanged={onLoanTypeChange} id={'loan-type-id'}
                                    images={loanTypeImages} />
                            </div>
                        </div>
                        {
                            loanDetailsOptions && (
                                <>
                                    <div className="row loan-type">
                                        <div className="col-12">
                                            <p className="question-style">{getStingOnLanguage('LOAN_TERM')}</p>
                                            <RadioButton options={loanDetailsOptions.loanTerm} onRadioChanged={onLoanTermChange} id={'loan-term-id'}
                                                images={loanTermImages} isReset={isReset} afterResetRadio={afterResetRadio} dafaultValue={loanTypeValue.loantermvalue} />
                                        </div>
                                    </div>
                                    <div className="row loan-type">
                                        <div className="col-12">
                                            <CustomeRadioButton radioOptionList={loanDetailsOptions?.loanDownPayment} imageList={loanTermImages} id='loan-down-payment'
                                                description={getStingOnLanguage('DOWN_PAYMENT')} getCustomRadioButtonValue={getCustomRadioButtonDownPaymentValue}
                                                isReset={isReset} afterResetRadio={afterResetRadio} />
                                        </div>
                                    </div>
                                    <div className="row loan-type">
                                        <div className={`${(loanDetailsOptions?.loanTypeOptionPMIDescription || loanDetailsOptions?.loanTypeOptionMIPDescription) && mIPPMIVisible ? 'col-6' : 'col-12'}`}>
                                            <TextWithEditField labelvalue={loanDetailsOptions?.loanTypeOptionInterestRateLabel} defaultValue={loanTypeValue.interestrate}
                                                type='percentage' id='interest-rate' onEditFieldChange={onEditFieldChange}
                                                isReset={isReset} afterResetRadio={afterResetRadio} />
                                        </div>
                                        {
                                            loanDetailsOptions?.loanTypeOptionPMIDescription && mIPPMIVisible && (
                                                <div className="col-6">
                                                    <TextWithEditField labelvalue={loanDetailsOptions?.loanTypeOptionPMIDescription} defaultValue={loanTypeValue.pmirate}
                                                        type='percentage' id='pmi-rate' onEditFieldChange={onEditFieldChange}
                                                        isReset={isReset} afterResetRadio={afterResetRadio} />
                                                </div>
                                            )
                                        }
                                        {
                                            loanDetailsOptions?.loanTypeOptionMIPDescription && mIPPMIVisible && (
                                                <div className="col-6">
                                                    <TextWithEditField labelvalue={loanDetailsOptions?.loanTypeOptionMIPDescription} defaultValue={loanTypeValue.miprate}
                                                        type='percentage' id='mip-rate' onEditFieldChange={onEditFieldChange}
                                                        isReset={isReset} afterResetRadio={afterResetRadio} />
                                                </div>
                                            )
                                        }

                                    </div>
                                    {
                                        loanDetailsOptions?.fund?.length > 0 && (
                                            <div className="row loan-type">
                                                <div className="col-12">
                                                    <p className="question-style">{loanDetailsOptions.loanTypeOptionVAFundingFeeDescription}</p>
                                                    <RadioButton options={loanDetailsOptions.fund} onRadioChanged={onFundingFeeChange} id={'loan-fund-id'}
                                                        images={loanFundImages} isReset={isReset} afterResetRadio={afterResetRadio} />
                                                </div>
                                            </div>
                                        )

                                    }

                                    {
                                        loanDetailsOptions?.finance?.length > 0 && mIPPMIVisible && (
                                            <div className="row loan-type">
                                                <div className="col-12">
                                                    <p className="question-style">{getStingOnLanguage('MIP_FINANCED')}</p>
                                                    <RadioButton options={loanDetailsOptions.finance} onRadioChanged={onMIPFinanceChange} id={'loan-finance-id'}
                                                        images={loanFinanceImages} isReset={isMIPReset || isReset} afterResetRadio={afterResetRadio} />
                                                </div>
                                            </div>
                                        )

                                    }
                                    {
                                        getLoanTypeValue() && (
                                            <div className="row sales-next-btn">
                                                <div className="col-12">
                                                    <p>{getStingOnLanguage('LOAN_TYPE_TEXT')} {isNextButton(onNextButtonClick)}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                </>
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

export default LoanType