import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import ToggleButton from '../atomiccomponent/ToggleButton'
import { constantValues } from '../utils/constants'
import { getStingOnLanguage, isNextButton } from '../utils/utility'
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
                <span>{getStingOnLanguage('LENDER_ORIGINATION_FEES')} ${value.lenderoriginationfees}</span>
                <span>{getStingOnLanguage('APPRISAL')} ${value.apprisal}</span>
                <span>{getStingOnLanguage('CREDIT_REPORT')} ${value.creditreport}</span>
                <span>{getStingOnLanguage('TAX_SERVICES')} ${value.taxservices}</span>
                <span>{getStingOnLanguage('FLOOD_CERTIFICATE')} ${value.floodcertificate}</span>
                <span>{getStingOnLanguage('LENDER_INSPECTION_FEE')} ${value.lenderinspectionfee}</span>
                <span>{getStingOnLanguage('PROCESSING_FEE_FEES')} ${value.pocessingfee}</span>
                <span>{getStingOnLanguage('UNDERWRITER_FEES')} ${value.underwriterfees}</span>
                <span>{getStingOnLanguage('MORTGAGE_BROKER_FEES')} ${value.mortggebrokerfees}</span>
                <span>{getStingOnLanguage('OTHER_FEES')} ${value.otherfees}</span>
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