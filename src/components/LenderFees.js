import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import ToggleButton from '../atomiccomponent/ToggleButton'
import { constantValues } from '../utils/constants'
import { isNextButton } from '../utils/utility'
import CollapseDetails from './CollpaseDetails'

const LenderFees = ({ instruction, lenderCost, onLenderFeesValue, onCollapseClick, setEnableButton }) => {

    const [lenderFeesInstruction, setLenderFeesInstruction] = useState(instruction)
    const [lenderFeesExpenesList, setLenderFeesExpenesList] = useState([])
    const [isExpand, setExpand] = useState(true)
    const [value, setValue] = useState({
        lenderoriginationfees: '',
        apprisal: '',
        creditreport: '',
        taxservices: '',
        floodcertificate: '',
        lenderinspectionfee: '',
        pocessingfee: '',
        underwriterfees: '',
        mortggebrokerfees: '',
        otherfees: ''
    })
    useEffect(() => {
        const list = []
        lenderCost?.lenderCostOptionList?.map(lenderCost => {

            list.push({
                ...lenderCost,
                desc: lenderCost.lenderCostOptionDescription,
                defaultValue: lenderCost.lenderCostOptionsDefaultValues,
                id: lenderCost.lenderCostOptionId
            })
        })
        setLenderFeesExpenesList(list)
    }, [lenderCost])

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setValue({
                lenderoriginationfees: '',
                apprisal: '',
                creditreport: '',
                taxservices: '',
                floodcertificate: '',
                lenderinspectionfee: '',
                pocessingfee: '',
                underwriterfees: '',
                mortggebrokerfees: '',
                otherfees: ''
            })
            setLenderFeesInstruction(ins)
        }, 'LenderFees')
    }

    const setLenderExpense = (lendervalue, id) => {
        console.log('setLenderExpense', lendervalue, id)
        switch (id) {
            case constantValues.LENDER_FEES_Lender_Origination_Fees:
                value.lenderoriginationfees = lendervalue.currencyValue
                break
            case constantValues.LENDER_FEES_Apprisal:
                value.apprisal = lendervalue.currencyValue
                break
            case constantValues.LENDER_FEES_Credit_Report:
                value.creditreport = lendervalue.currencyValue
                break
            case constantValues.LENDER_FEES_Tax_Services:
                value.taxservices = lendervalue.currencyValue
                break
            case constantValues.LENDER_FEES_Flood_Certificate:
                value.floodcertificate = lendervalue.currencyValue
                break
            case constantValues.LENDER_FEES_Lender_Inspection_Fee:
                value.lenderinspectionfee = lendervalue.currencyValue
                break
            case constantValues.LENDER_FEES_Processing_Fee_Fees:
                value.pocessingfee = lendervalue.currencyValue
                break
            case constantValues.LENDER_FEES_UnderWriter_Fees:
                value.underwriterfees = lendervalue.currencyValue
                break
            case constantValues.LENDER_FEES_Mortgage_Broker_Fees:
                value.mortggebrokerfees = lendervalue.currencyValue
                break
            case constantValues.LENDER_FEES_Other_Fees:
                value.otherfees = lendervalue.currencyValue
                break


        }

        setValue({
            ...value
        })
    }

    const getLenderFees = () => {
        const pattern = /(^[0-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        const keysArray = Object.keys(value)
        return keysArray.every(item => ![''].includes(value[item]) && value[item]?.match(pattern) !== null)
    }

    const onNextButtonClick = () => {
        setExpand(false)
        setLenderFeesInstruction()
        onLenderFeesValue({
            ...value
        })
        setEnableButton && setEnableButton(true, 'LenderFee')
    }

    const getHtmlContent = () => {
        return (
            <>
                <span>Lender Origination fees: ${value.lenderoriginationfees}</span>
                <span>Apprisal: ${value.apprisal}</span>
                <span>Credit Report: ${value.creditreport}</span>
                <span>Tax Services: ${value.taxservices}</span>
                <span>Flood Certificate: ${value.floodcertificate}</span>
                <span>Lender inspection fee: ${value.lenderinspectionfee}</span>
                <span>Processing fee fees: ${value.pocessingfee}</span>
                <span>UnderWriter fees: ${value.underwriterfees}</span>
                <span>Mortgage broker fees: ${value.mortggebrokerfees}</span>
                <span>Other fees: ${value.otherfees}</span>
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
                                lenderFeesExpenesList.length > 0 && lenderFeesExpenesList.map(lender => (
                                    <ToggleButton isDescEdit={false} description={lender.desc}
                                        currencyDefaultValue={lender.defaultValue} id={lender.id} isChecked={true} setExpenses={setLenderExpense} />
                                ))
                            }
                        </div>
                        {
                            getLenderFees() && (
                                <div className="row sales-next-btn">
                                    <div className="col-12">
                                        <p>{constantValues.LENDER_FEE_TEXT} {isNextButton(onNextButtonClick)}</p>
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

export default LenderFees