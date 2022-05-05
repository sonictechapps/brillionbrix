import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import ToggleButton from '../atomiccomponent/ToggleButton'
import { constantValues } from '../utils/constants'
import { addCommaInNumber, getCurrencyValidationRegexPattern, getStingOnAPILanguage, getStingOnLanguage, isNextButton } from '../utils/utility'
import CollapseDetails from './CollpaseDetails'

const LenderFees = ({ instruction, lenderCost, onLenderFeesValue, onCollapseClick, setEnableButton }) => {
    const [lenderFeesInstruction, setLenderFeesInstruction] = useState(instruction)
    const [lenderFeesExpenesList, setLenderFeesExpenesList] = useState([])
    const [isExpand, setExpand] = useState(true)
    let [value, setValue] = useState([])
    useEffect(() => {
        const list = []
        lenderCost?.lenderCostOptionList.length > 0 && lenderCost?.lenderCostOptionList?.map(lenderCost => {
            list.push({
                ...lenderCost,
                desc: getStingOnAPILanguage(lenderCost, 'lenderCostOptionDescription'),
                defaultValue: lenderCost.lenderCostOptionsDefaultValues.toString(),
                id: lenderCost.lenderCostOptionId
            })
        })
        setLenderFeesExpenesList(list)
        setValue(list)
    }, [lenderCost])

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
           // setValue([])
            setLenderFeesInstruction(ins)
        }, 'LenderFees')
    }

    const setLenderExpense = (lendervalue, id) => {
        console.log('valuee-->', value, lendervalue, id)
        // switch (id) {
        //     case constantValues.LENDER_FEES_Lender_Origination_Fees:
        //         value.lenderoriginationfees = lendervalue.currencyValue
        //         break
        //     case constantValues.LENDER_FEES_Apprisal:
        //         value.apprisal = lendervalue.currencyValue
        //         break
        //     case constantValues.LENDER_FEES_Credit_Report:
        //         value.creditreport = lendervalue.currencyValue
        //         break
        //     case constantValues.LENDER_FEES_Tax_Services:
        //         value.taxservices = lendervalue.currencyValue
        //         break
        //     case constantValues.LENDER_FEES_Flood_Certificate:
        //         value.floodcertificate = lendervalue.currencyValue
        //         break
        //     case constantValues.LENDER_FEES_Lender_Inspection_Fee:
        //         value.lenderinspectionfee = lendervalue.currencyValue
        //         break
        //     case constantValues.LENDER_FEES_Processing_Fee_Fees:
        //         value.pocessingfee = lendervalue.currencyValue
        //         break
        //     case constantValues.LENDER_FEES_UnderWriter_Fees:
        //         value.underwriterfees = lendervalue.currencyValue
        //         break
        //     case constantValues.LENDER_FEES_Mortgage_Broker_Fees:
        //         value.mortggebrokerfees = lendervalue.currencyValue
        //         break
        //     case constantValues.LENDER_FEES_Other_Fees:
        //         value.otherfees = lendervalue.currencyValue
        //         break


        // }
        value = value.map(val => {
            if (val.id === id) {
                val.defaultValue = lendervalue.currencyValue
            }
            return val
        })

        setValue(value)
    }

    const getLenderFees = () => {
        const pattern = getCurrencyValidationRegexPattern()
       // const keysArray = Object.keys(value)
       return value.every(item => ![''].includes(item.defaultValue) && item.defaultValue?.match(pattern) !== null)
    }

    const onNextButtonClick = () => {
        setExpand(false)
        setLenderFeesInstruction()
        onLenderFeesValue(value)
        setEnableButton && setEnableButton(true, 'LenderFee')
    }

    const getHtmlContent = () => {
        return (
            <>
            {
                value.map(val=> (
                    <span>{val.desc}: ${addCommaInNumber(val.defaultValue)}</span>
                ))
            }
            </>
        )
    }
    return (
        <Card instruction={lenderFeesInstruction}>
            {
                isExpand && (
                    <>
                        <div style={{ marginTop: '40px' }}>
                            {
                                lenderFeesExpenesList.length > 0 && lenderFeesExpenesList.map((lender, index) => (
                                    <ToggleButton isDescEdit={false} description={lender.desc}
                                        currencyDefaultValue={lender.defaultValue} id={lender.id} isChecked={true} setExpenses={ setLenderExpense} 
                                        index={index} />
                                ))
                            }
                        </div>
                        <div className='lender-fees-warning'>
                            <p>{getStingOnLanguage('LENDER_FEES_WARNING')}</p>
                        </div>
                        {
                            getLenderFees() && (
                                <div className="row sales-next-btn">
                                    <div className="col-12">
                                        <p>{getStingOnLanguage('LENDER_FEE_TEXT')} {isNextButton(onNextButtonClick)}</p>
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
                            <CollapseDetails htmlContent={getHtmlContent()} onEditClick={onCollpase}  showEdit={true} />
                        </div>
                    </div>
                )
            }

        </Card>
    )
}

export default LenderFees