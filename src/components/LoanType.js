import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CustomeRadioButton from '../atomiccomponent/CustomeRadioButton'
import RadioButton from '../atomiccomponent/RadioButton'
import TextWithEditField from '../atomiccomponent/TextWithEditField'
import { constantValues } from '../utils/constants'
import '../sass/loantype.scss'
import CollapseDetails from './CollpaseDetails'
import { isNextButton } from '../utils/utility'

const LoanType = ({ instruction, loanType, salesprice, onCollapseClick, onLoanTypeValue }) => {
    const [loanInstruction, setLoanInstruction] = useState(instruction)
    const [loanTypeOptions, setLoanTypeOptions] = useState([])
    const [loanDetailsOptions, setLoanDetailsOptions] = useState()
    const [isExpand, setExpand] = useState(true)
    const [mIPPMIVisible, setMIPPMIVisible] = useState(false)
    const [isReset, setReset] = useState(false)
    const [isMIPReset, setMIPReset] = useState(false)
    //let loanValue, loanTermValue, fundingfeeValue, downPaymentValue, mipValue
    const [loanTypeValue, setLoanTypeValue] = useState({
        loantype: '',
        loanValue: '',
        loanterm: '',
        downpaymentid: '',
        downpaymentamount: '',
        fundingfee: '',
        mipinsurence: '',

    })
    const loanTypeImages = ['/images/DefaultForState.png', '/images/BuyerPays.png', '/images/5050split.png']
    const loanTermImages = ['/images/DefaultForState.png', '/images/BuyerPays.png', '/images/5050split.png']
    const loanFundImages = ['/images/DefaultForState.png', '/images/BuyerPays.png', '/images/5050split.png']
    const loanFinanceImages = ['/images/DefaultForState.png', '/images/BuyerPays.png']

    const onLoanTypeChange = (index, value, name) => {
        console.log('loantypeoptions', name)
        getLoanDetsils(loanTypeOptions[index])
        setLoanTypeValue({
            ...loanTypeValue,
            loantype: value,
            loanValue: name
        })
        // console.log('loanDetailsOptions', loanTypeOptions[index].name)
        // loanValue = loanTypeOptions[index].name
    }

    useEffect(() => {
        if (loanType?.loanTypeOptionlist?.length > 0) {
            const loanTypedropDownarr = []
            loanType?.loanTypeOptionlist.forEach(loan => {
                let obj = {
                    ...loan,
                    name: loan.loanTypeOptionDescription,
                    value: loan.loanTypeOptionId
                }
                loanTypedropDownarr.push(obj)
            })
            setLoanTypeOptions(loanTypedropDownarr)
            getLoanDetsils(loanTypedropDownarr[0])


        }
    }, [loanType])

    const onLoanTermChange = (index, value, name) => {
        setLoanTypeValue({
            ...loanTypeValue,
            loanterm: value,
            loantermvalue: name
        })
    }

    const onFundingFeeChange = (index, value, name) => {
        setLoanTypeValue({
            ...loanTypeValue,
            fundingfee: value,
            fundingfeevalue: name
        })
    }

    const onMIPFinanceChange = (index, value, name) => {
        setLoanTypeValue({
            ...loanTypeValue,
            mipinsurence: value,
            mipinsurencevalue: name
        })
    }

    const getLoanDetsils = (loanType) => {
        setReset(true)
        console.log('loantype', loanType)
        setMIPPMIVisible(false)
        const loanTermArr = []
        const loanDownpaymentArr = []
        const fundArr = []
        const financeArr = []
        loanType?.loanTypeOptionTermList.forEach(loanType => {
            let value = {
                name: loanType.loanTypeOptionTermDescription,
                value: loanType.loanTypeOptionTermId
            }
            loanTermArr.push(value)
        })
        loanType?.loanTypeOptionDownPaymentList.forEach(downPayment => {
            let value = {
                desc: downPayment.loanTypeOptionDownPaymentDescription,
                value: downPayment.loanTypeOptionDownPaymentId,
                defaultValue: downPayment.loanTypeOptionDownPaymentDefaultValue,
                isInput: downPayment.loanTypeOptionDownPaymentId === '1' ? false : true,
                isType: downPayment.loanTypeOptionDownPaymentId === '2' ? 'percentage' : 'currency',
            }
            loanDownpaymentArr.push(value)
        })
        loanType?.loanTypeOptionVAFundingFeeValueList?.forEach(fund => {
            console.log('fund-->', fund)
            let value = {
                name: fund.loantypeOptionVAFundingFeeValue,
                value: fund.loantypeOptionVAFundingFeeId
            }
            fundArr.push(value)
        })
        loanType?.loanTypeOptionIsMIPFinanceList?.forEach(finance => {
            console.log('finance-->', finance)
            let value = {
                name: finance.loanTypeOptionIsMIPFinanceOption,
                value: finance.loanTypeOptionIsMIPFinanceOptionId
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
    }

    const getCustomRadioButtonDownPaymentValue = (value, name) => {
        console.log('getCustomRadioButtonDownPaymentValue', name)
        setMIPReset(false)
        const pattern = /(^[1-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        const selectedValueForPercentage = parseInt(value?.amount?.find(v => v.id === '2').value)
        const selectedValueForAmount = (parseInt(value?.amount?.find(v => v.id === '3').value) / salesprice) * 100
        console.log('value---0', selectedValueForAmount)
        // console.log('selectedValue', selectedValue)
        // const pecentageCalculate = (selectedValueForAmount / salesprice) * 100

        if ((value.radioValue === '2' && selectedValueForPercentage > 0 && selectedValueForPercentage < 20 && value?.amount?.find(v => v.id === '2').value.match(pattern) !== null)
            || (value.radioValue === '3' && selectedValueForAmount > 0 && selectedValueForAmount < 20 && value?.amount?.find(v => v.id === '3').value.match(pattern) !== null)) {
            setMIPPMIVisible(true)
            setMIPReset(true)
        } else {
            setMIPPMIVisible(false)
        }

        let amount = ''
        switch (value.radioValue) {
            case '1':
                amount = value.amount[0].value
                break;
            case '2':
                amount = value.amount[1].value
                break;
            case '3':
                amount = value.amount[2].value
                break;
            default:
                break;
        }

        setLoanTypeValue({
            ...loanTypeValue,
            downpaymentid: value.radioValue,
            downpaymentamount: amount,
            downpaymentvalue: name
        })
    }

    const onEditFieldChange = (value, id, index) => {
        console.log('onEditFieldChange', value, id)
        switch (id) {
            case 'interest-rate':
                loanTypeValue['interestrate'] = value
                break
            case 'pmi-rate':
                loanTypeValue['pmirate'] = value
                break
            case 'mip-rate':
                loanTypeValue['miprate'] = value
                break
            default:
                break
        }
        console.log('pppppppp', loanTypeValue)
        setLoanTypeValue({
            ...loanTypeValue
        })
    }



    const getLoanTypeValue = () => {

        const pattern = /(^[0-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        console.log('next-->', loanTypeValue)


        // outerloop: for (let item of conventional) {
        //     console.log('check11', loanTypeValue[item]?.match(pattern) === null, item)
        //     if (['', '0'].includes(loanTypeValue[item]) && loanTypeValue[item]?.match(pattern) === null) {
        //         console.log('check', item)
        //         a = false
        //         break outerloop
        //     }
        // }
        // console.log('check12')
        // return a
        switch (loanTypeValue.loantype) {
            case '1':
                const conventional = ['loantype', 'loanterm', 'downpaymentid', 'downpaymentamount', 'interestrate', 'pmirate']
                return conventional.every(item => !['', '0'].includes(loanTypeValue[item]) && loanTypeValue[item]?.match(pattern) !== null)
                break
            case '2':
                const va = ['loantype', 'loanterm', 'downpaymentid', 'downpaymentamount', 'interestrate', 'fundingfee']
                console.log('fundingfee', loanTypeValue['fundingfee'])
                return va.every(item => !['', '0'].includes(loanTypeValue[item]) && loanTypeValue[item]?.match(pattern) !== null)
                break
            case '3':
                const fha = ['loantype', 'loanterm', 'downpaymentid', 'downpaymentamount', 'interestrate', 'miprate', 'mipinsurence']
                return fha.every(item => !['', '0'].includes(loanTypeValue[item]) && loanTypeValue[item]?.match(pattern) !== null)
                break

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
                <span>Loan Type: {loanTypeValue.loanValue}</span>
                <span>Loan Term: {loanTypeValue.loantermvalue}</span>
                {/* <span>{${loanTypeValue.loantype === '1' ? }}: {`${loanTypeValue.loantype === '3' ? '$' : ''}${loanTypeValue.downpaymentvalue}${loanTypeValue.loantype !== '3' ? '%' : ''}`}</span> */}
                <span>Interest Rate: {loanTypeValue.interestrate}%</span>
                {
                    loanDetailsOptions?.loanTypeOptionMIPDescription && mIPPMIVisible &&
                    <span>MIP Rate: {loanTypeValue.miprate}%</span>
                }
                {
                    loanDetailsOptions?.loanTypeOptionPMIDescription && mIPPMIVisible &&
                    <span>PMI Rate: {loanTypeValue.pmirate}%</span>
                }
                {
                    loanDetailsOptions?.finance?.length > 0 && mIPPMIVisible &&
                    <span>MIP Finance: {loanTypeValue.mipinsurencevalue}</span>
                }
                {
                    loanDetailsOptions?.fund?.length > 0 &&
                    <span>VA Funding: {loanTypeValue.fundingfeevalue}</span>
                }
            </>
        )
    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setLoanTypeValue({
                loantype: '',
                loanterm: '',
                downpaymentid: '',
                downpaymentamount: '',
                fundingfee: '',
                mipinsurence: '',
            })
            setLoanInstruction(ins)
        }, 'LoanType')
    }

    return (
        <Card instruction={loanInstruction}>
            {/* {console.log('loan details', loanDetailsOptions)} */}
            {
                isExpand && (
                    <>
                        <div className="row loan-type">
                            <div className="col-12">
                                <p className="question-style">{constantValues.LOAN_TYPE}</p>
                                <RadioButton options={loanTypeOptions} onRadioChanged={onLoanTypeChange} id={'loan-type-id'}
                                    images={loanTypeImages} />
                            </div>
                        </div>
                        {
                            loanDetailsOptions && (
                                <>
                                    <div className="row loan-type">
                                        <div className="col-12">
                                            <p className="question-style">{constantValues.LOAN_TERM}</p>
                                            <RadioButton options={loanDetailsOptions.loanTerm} onRadioChanged={onLoanTermChange} id={'loan-term-id'}
                                                images={loanTermImages} isReset={isReset} afterResetRadio={afterResetRadio} />
                                        </div>
                                    </div>
                                    <div className="row loan-type">
                                        <div className="col-12">
                                            <CustomeRadioButton radioOptionList={loanDetailsOptions?.loanDownPayment} imageList={loanTermImages} id='loan-down-payment'
                                                description={constantValues.DOWN_PAYMENT} getCustomRadioButtonValue={getCustomRadioButtonDownPaymentValue}
                                                isReset={isReset} afterResetRadio={afterResetRadio} />
                                        </div>
                                    </div>
                                    <div className="row loan-type">
                                        <div className={`${(loanDetailsOptions?.loanTypeOptionPMIDescription || loanDetailsOptions?.loanTypeOptionMIPDescription) && mIPPMIVisible ? 'col-6' : 'col-12'}`}>
                                            <TextWithEditField labelvalue={loanDetailsOptions?.loanTypeOptionInterrestRateLabel} defaultValue={loanDetailsOptions?.loanTypeOptionInterrestRatedefaultValue}
                                                type='percentage' id='interest-rate' onEditFieldChange={onEditFieldChange}
                                                isReset={isReset} afterResetRadio={afterResetRadio} />
                                        </div>
                                        {
                                            loanDetailsOptions?.loanTypeOptionPMIDescription && mIPPMIVisible && (
                                                <div className="col-6">
                                                    <TextWithEditField labelvalue={loanDetailsOptions?.loanTypeOptionPMIDescription} defaultValue={loanDetailsOptions?.loanTypeOptionPMIDefaultValue}
                                                        type='percentage' id='pmi-rate' onEditFieldChange={onEditFieldChange}
                                                        isReset={isReset} afterResetRadio={afterResetRadio} />
                                                </div>
                                            )
                                        }
                                        {
                                            loanDetailsOptions?.loanTypeOptionMIPDescription && mIPPMIVisible && (
                                                <div className="col-6">
                                                    <TextWithEditField labelvalue={loanDetailsOptions?.loanTypeOptionMIPDescription} defaultValue={loanDetailsOptions?.loanTypeOptionMIPDefaultValue}
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
                                                    <p className="question-style">{constantValues.MIP_FINANCED}</p>
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
                                                    <p>{constantValues.LOAN_TYPE_TEXT} {isNextButton(onNextButtonClick)}</p>
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
                        <div className="col-12" className='dropDownCollapse-active'>
                            <CollapseDetails htmlContent={getHtmlContent()} onEditClick={onCollpase} />
                        </div>
                    </div>
                )
            }
        </Card>
    )
}

export default LoanType