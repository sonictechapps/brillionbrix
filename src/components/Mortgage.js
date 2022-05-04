import { useEffect, useState } from 'react'
import React from 'react'
import Card from '../atomiccomponent/Card'
import RadioButton from '../atomiccomponent/RadioButton'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import '../sass/mortgage.scss'
import CollapseDetails from './CollpaseDetails'
import { constantValues } from '../utils/constants'
import { getLanguage, getStingOnAPILanguage, getStingOnLanguage, isNextButton } from '../utils/utility'

const Mortgage = ({ mortgage, onMortgageValue, instruction, onCollapseClick }) => {
    // const mortgageOption, setMortgageOption = useState([])
    const [mortgageOption, setMortgageOption] = useState([])
    const [loanAmount, setLoanAmout] = useState([])
    const [values, setValues] = useState([])
    const [indexNumber, setIndexNumber] = useState({})
    const [isExpand, setExpand] = useState(true)
    const [mortgageValues, setMortgageValues] = useState({
        inpvalue: [],
        mort: ''
    })
    const [mortgageInstruction, setMortgageInstruction] = useState(instruction)

    const mortgageeWithImages = (id) => {
        switch ((id)) {
            case constantValues.NO_MORTGAGE_ID:
                return 'images/no_mortgage.png'
            case constantValues.ONE_OUTSTANDING_MORTGAGE_ID:
                return 'images/one_mortgage.png'
            case constantValues.TWO_OUTSTANDING_MORTGAGE_ID:
                return 'images/two_mortgage.png'
        }
    }

    useEffect(() => {
        if (mortgage?.mortgageOptionList?.length > 0) {
            const mortgageDropdown = []
            mortgage?.mortgageOptionList.forEach((mortgage, index) => {

                let obj = {
                    ...mortgage,
                    name: getLanguage().toLowerCase() === 'es' ? mortgage.mortgageOptionDescription_es : mortgage.mortgageOptionDescription,
                    value: mortgage.mortgageOptionId,
                    image: mortgageeWithImages(mortgage.mortgageOptionId)
                }
                mortgageDropdown.push(obj)
            })
            setMortgageOption(mortgageDropdown)

        }
    }, [mortgage])

    const onMortgageChange = (index, value) => {
        let amount = []
        setIndexNumber({
            oldIndex: indexNumber.newIndex,
            newIndex: index
        })
        setLoanAmout([])
        if (mortgageOption[index]?.loanAmountOption) {
            //setValues([])
            let val = []
            mortgageOption[index]?.loanAmountOption?.map((loanAmountInput, ix) => {
                val[ix] = loanAmountInput?.loanAmountDefault.toString()
                amount.push(loanAmountInput)
                setLoanAmout(amount)
                // setValues(values)
            })
            setMortgageValues({
                inpvalue: val,
                mort: value
            })
            setValues(val)

        } else {
            setValues([])
            setMortgageValues({
                inpvalue: [],
                mort: value
            })

        }
        if (value === constantValues.NO_MORTGAGE_ID.toString()) {
            onNextButtonClick({
                inpvalue: [],
                mort: value
            })
        }


    }

    const onCurrencyChange = (value, id) => {
        switch (id) {
            case constantValues.FIRST_LOAN_AMOUNT_ID:
                values[0] = value
                break
            case constantValues.SECOND_LOAN_AMOUNT_ID:
                values[1] = value
                break

        }
        setValues(values)
        setMortgageValues({
            ...mortgageValues,
            inpvalue: values
        })

    }

    const onNextButtonClick = (value) => {
        setExpand(false)
        setLoanAmout([])
        setMortgageInstruction()
        onMortgageValue(value || mortgageValues)
    }

    const getMortgageValue = () => {
        const pattern = /^[1-9][0-9]*(\,[0-9]+)*(\.[0-9]+)?$/gm
        let inValue = new Set(mortgageValues?.inpvalue.map(val => val.toString()?.match(pattern) !== null))
        return (mortgageValues && (mortgageValues?.inpvalue?.length > 0 && inValue.size === 1 && inValue.values().next().value === true && mortgageValues?.mort !== '') ||
            (mortgageValues?.inpvalue?.length === 0 && mortgageValues?.mort === constantValues.NO_MORTGAGE_ID))
    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setMortgageValues({
                inpvalue: [],
                mort: ''
            })
            setMortgageInstruction(ins)
        }, 'Mortgage')
    }

    const getHtmlContent = () => {
        return (
            <>
                {
                    mortgageValues?.inpvalue.length === 0 && <span>{getStingOnLanguage('NO_MORTGAGE_SPAN')}</span>
                }
                {
                    mortgageValues?.inpvalue.length === 1 && <span>{getStingOnLanguage('FIRST_MORTGAGE_SPAN')} ${mortgageValues?.inpvalue[0]}</span>
                }
                {
                    mortgageValues?.inpvalue.length === 2 && (
                        <>
                            <span>{getStingOnLanguage('FIRST_MORTGAGE_SPAN')} ${mortgageValues?.inpvalue[0]}</span>
                            <span>{getStingOnLanguage('SECOND_MORTGAGE_SPAN')} ${mortgageValues?.inpvalue[1]}</span>
                        </>
                    )

                }
            </>
        )
    }
    return (
        <Card instruction={mortgageInstruction}>
            {
                isExpand && (
                    <>
                        <div className="row mortgage">
                            <div className="col-12">
                                <p className="question-style">{getStingOnAPILanguage(mortgage, 'mortgagePaymentLabel')}</p>
                                <RadioButton options={mortgageOption} onRadioChanged={onMortgageChange} id={'insu-paid-id'}
                                />
                            </div>
                        </div>

                        <div className="row">

                            {
                                loanAmount.length > 0 && loanAmount.map((loan, index) => (
                                    <div className={`col-12 ${loanAmount.length === 1 ? 'col-md-12 mort-currency-edit' : 'col-md-6'}`}>
                                        <CurrencyEditText placeholder="" type="text"
                                            defaultValue={values[index]} id={loan.loanAmountOptionId}
                                            labelText={getStingOnAPILanguage(loan, 'loanAmountDescription')} onCurrencyChange={onCurrencyChange} isReset={indexNumber.oldIndex !== indexNumber.newIndex} />
                                    </div>
                                ))
                            }
                        </div>
                        {
                            getMortgageValue() && (
                                <div className="row sales-next-btn">
                                    <div className="col-12">
                                        <p>{getStingOnLanguage('MORTGAGE_TEXT')} {isNextButton(onNextButtonClick)}</p>
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

export default Mortgage