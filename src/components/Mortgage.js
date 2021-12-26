import { useEffect, useState } from 'react'
import React from 'react'
import Card from '../atomiccomponent/Card'
import RadioButton from '../atomiccomponent/RadioButton'
import CurrencyEditText from '../atomiccomponent/CurrencyEditText'
import '../sass/mortgage.scss'
import CollapseDetails from './CollpaseDetails'

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
    const mortgageImages = ['/images/no_mortgage.png', '/images/one_mortgage.png', '/images/two_mortgage.png']
    useEffect(() => {
        if (mortgage?.mortgageOptionsList?.length > 0) {
            const mortgageDropdown = []
            mortgage?.mortgageOptionsList.forEach((mortgage, index) => {

                let obj = {
                    ...mortgage,
                    name: mortgage.mortgageOptionDescription,
                    value: mortgage.mortgageOptionId
                }
                mortgageDropdown.push(obj)
            })
            setMortgageOption(mortgageDropdown)

        }
    }, [mortgage])
    let oldIndex
    const onMortgageChange = (index, value) => {
        let amount = []
        setIndexNumber({
            oldIndex: indexNumber.newIndex,
            newIndex: index
        })
        setLoanAmout([])
        if (mortgageOption[index]?.loanAmount) {
            mortgageOption[index]?.loanAmount?.loanAmountOptionList?.map((loanAmountInput, ix) => {
                values[ix] = ''
                amount.push(loanAmountInput)
                setLoanAmout(amount)
                setValues(values)
            })
            setMortgageValues({
                inpvalue: values,
                mort: value
            })
           
        } else {
            setValues([])
            setMortgageValues({
                inpvalue: [],
                mort: value
            })
          
        }


    }

    const onCurrencyChange = (value, id) => {
        switch (id) {
            case '1':
                values[0] = value
                break
            case '2':
                values[1] = value
                break

        }
        setValues(values)
        setMortgageValues({
            ...mortgageValues,
            inpvalue: values
        })
      
    }

    const onNextButtonClick = () => {
        setExpand(false)
        setLoanAmout([])
        setMortgageInstruction()
        onMortgageValue(mortgageValues)
    }

    const getMortgageValue = () => {
        let inValue = new Set(mortgageValues?.inpvalue.map(val => !['', '0'].includes(val)))
        return (mortgageValues && (mortgageValues?.inpvalue?.length > 0 && inValue.size === 1 && inValue.values().next().value === true && mortgageValues?.mort !== '') ||
            (mortgageValues?.inpvalue?.length === 0 && mortgageValues?.mort === '1'))
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
                    mortgageValues?.inpvalue.length === 0 && <span>No Mortgage</span>
                }
                {
                    mortgageValues?.inpvalue.length === 1 && <span>1st Mortgage: ${mortgageValues?.inpvalue[0]}</span>
                }
                {
                    mortgageValues?.inpvalue.length === 2 && (
                        <>
                            <span>1st Mortgage: ${mortgageValues?.inpvalue[0]}</span>
                            <span>2nd Mortgage: ${mortgageValues?.inpvalue[1]}</span>
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
                    <p className="question-style">{mortgage?.mortgagePaymentLabel}</p>
                    <RadioButton options={mortgageOption} onRadioChanged={onMortgageChange} id={'insu-paid-id'}
                        images={mortgageImages} />
                </div>
            </div>

            <div className="row">
                {
                    loanAmount.length > 0 && loanAmount.map((loan, index) => (
                        <div className={`col-12 ${loanAmount.length === 1 ? 'col-md-12 mort-currency-edit' : 'col-md-6'}`}>
                            <CurrencyEditText placeholder="Enter property sales price" type="text"
                                defaultValue={loan.loanAmountDefault} id={loan.loanAmountOptionId}
                                labelText={loan.loanAmountDescription} onCurrencyChange={onCurrencyChange} isReset={indexNumber.oldIndex !== indexNumber.newIndex} />
                        </div>
                    ))
                }
            </div>
            {
                getMortgageValue() && (
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

export default Mortgage