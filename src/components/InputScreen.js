import React, { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import '../sass/inputscreen.scss'
import { PostData, getWithRawRequest } from "../http/AsyncService"
import { constantValues } from "../utils/constants"
import { loadingData, onInputFailure, onInputSuccess, onInputSubmitSuccess, onInputSubmitFailure } from "../redux/actioncreator/InputAction"
import LocationInput from "./LocationInput"
import Stepper from "../atomiccomponent/Stepper"
import ConfirmationModalPortal from "./ConfirmationModalPortal"
import { getColor, setColor, setSubmitButtonStyle } from '../utils/utility'
import BranchComponent from "./BranchComponent"
import TransactionType from "./TransactionType"
import TitlePolicyPaid from "./TitlePolicyPaid"
import { useNavigate } from 'react-router'

const InputScreen = () => {
    const history = useNavigate()
    const dispatch = useDispatch()
    const { companyBranchList, transactionTypesList, companyID, companyName, companyBGColor, ...otherValue } = useSelector(state => state?.input?.input)
    const response = useSelector(state => state?.input?.inputsubmit)
    const [dropDownBranchOptions, setDropDownBranchOptions] = useState([])
    const [dropDownTransactionOptions, setDropDownTransactionOptions] = useState([])
    const [transactionValue, setTransactionValue] = useState()
    const [branch, setBranch] = useState()
    const [insurencePaid, setInsurenePaid] = useState()
    const [instruction, setInstruction] = useState(constantValues.VIRTUAL_ASSISTANT)
    const [modalShowPortal, setModalShowPortal] = useState(false)
    let [isButtonEnable, setButtonEnable] = useState(false)
    const [location, setLocation] = useState()
    const [step, setStep] = useState(0)
    const [selectedField, setSelectedField] = useState('')
    const [responseJson, setJsonResponse] = useState({})
    const [stepArray, setStepArray] = useState(['images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png'])
    const [branchExpand, setBranchExpand] = useState()

    const mapTransationTypeWithImages = (id) => {
        switch ((id)) {
            case constantValues.TRANSACTION_TYPE_PURCHASE_WITH_CASH:
                return '/images/cash_transfer.png'
            case constantValues.TRANSACTION_TYPE_REFINANCE:
                return '/images/refinance.png'
            case constantValues.TRANSACTION_TYPE_REFINANCE_CASH_OUT:
                return '/images/refinancecashout.png'
            case constantValues.TRANSACTION_TYPE_PURCHASE_WITH_FINANCE:
                return '/images/purchasewithfinance.png'
        }
    }

    useEffect(() => {
        if (companyBranchList?.length > 0) {
            const dropDownarr = []
            companyBranchList.forEach(branch => {
                let branchObj = {
                    ...branch,
                    name: branch.companyBranchName,
                    value: branch.companyBranchId
                }
                dropDownarr.push(branchObj)
            })
            setDropDownBranchOptions(dropDownarr)
        }
        if (companyBranchList?.length === 0) {
            setStepArray(['images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png'])
        }

        if (transactionTypesList?.length > 0) {
            const dropDownarr = []
            transactionTypesList.forEach(transaction => {
                let tcObj = {
                    ...transaction,
                    name: transaction.transactionTypeDescription,
                    value: transaction.transactionTypeId,
                    image: mapTransationTypeWithImages(transaction.transactionTypeId)
                }
                dropDownarr.push(tcObj)
            })
            setDropDownTransactionOptions(dropDownarr)
        }
        companyBGColor && setColor(companyBGColor)
        dispatch({
            type: 'SET_COLOR',
            data: getColor()
        })
        //  "companyId":10000,
        //        "companzyName":"BillionBrixTitleCompany",
        //        "companyLogoURL":"S3://BrnahLogoURL",
        //        "companyBGColor":"Cyan",
        //        "companyFontColor":"Black",
        //        "companyFontStyle":"Font Style",
        //        "companyBranchId":"1000",
        //        "companyBranchName":"Cypress"
        responseJson['titleCompanyInfo'] = {
            companyName,
            companyId: companyID,
            companyBGColor,
            companyLogoURL: otherValue.companyLogoURL,
            companyFontColor: otherValue.companyFontColor,
            companyFontStyle: otherValue.companyFontStyle,
        }
        responseJson['propertyAddress'] = {}
        responseJson['selectedTransactionTypes'] = {}
        setJsonResponse(responseJson)
    }, [companyID])



    const getLocation = (location) => {
        setStep(stepArray.length === 4 ? 2 : 1)
        setInstruction(constantValues.TRANSACTION_TYPE_INSTRUCTION)
        setLocation({
            ...location

        })
        responseJson['propertyAddress'] = {
            ...location
        }
        delete responseJson['propertyAddress'].location
        delete responseJson['propertyAddress'].condo
        delete responseJson['propertyAddress'].description
        setJsonResponse(responseJson)
    }

    const onBranchChange = (index) => {
        setInstruction(constantValues.LOCATION_INSTRUCTION)
        setStep(1)
        if (branch !== dropDownBranchOptions[index].value) {
            setBranch({
                details: dropDownBranchOptions[index],
                index: index
            })
            responseJson.titleCompanyInfo['companyBranchName'] = dropDownBranchOptions[index].companyBranchName
            responseJson.titleCompanyInfo['companyBranchId'] = dropDownBranchOptions[index].companyBranchId
            setJsonResponse(responseJson)
        }
    }

    const onTransactionValueChanged = (value) => {
        if (value.transaction?.transactionTypeId) {
            setStep(stepArray.length === 4 ? 3 : 2)
            setInstruction([constantValues.TRANSACTION_TYPE_PURCHASE_WITH_CASH, constantValues.TRANSACTION_TYPE_PURCHASE_WITH_FINANCE].includes(value.transaction?.transactionTypeId) ?
                constantValues.INSURENCE_PAID_INSTRUCTION_CASH_FINANCE : constantValues.INSURENCE_PAID_INSTRUCTION_OTHERS)
            setTransactionValue(value)
            responseJson.selectedTransactionTypes = {}
            responseJson.selectedTransactionTypes.transactionTypeId = value.transaction.value
            responseJson.selectedTransactionTypes.transactionType = value.transaction.name

            setJsonResponse(responseJson)
        }
    }

    const getPageLoad = () => {
        const params = new URLSearchParams()
        params.append('companyId', '10000')

        dispatch(PostData(constantValues.BASE_URL1 + constantValues.INPUT_DETAILS1, 'get', params, onInputSuccess,
            onInputFailure, loadingData))
    }


    useEffect(() => {
        getPageLoad()
    }, [])



    const onYesCallback = () => {
        setModalShowPortal({
            ...modalShowPortal,
            value: false,
        })
        setEnableButton(false)
        switch (selectedField) {
            case 'Branch-DropDown':
                setBranch()
                setLocation()
                setTransactionValue()
                setInsurenePaid()
                setStep(0)
                setInstruction(constantValues.VIRTUAL_ASSISTANT)
                modalShowPortal.function(true, constantValues.VIRTUAL_ASSISTANT)
                break
            case 'Location':
                setStep(stepArray.length === 4 ? 1 : 0)
                setLocation()
                setTransactionValue()
                setInsurenePaid()
                setInstruction(constantValues.LOCATION_INSTRUCTION)
                modalShowPortal.function(true, constantValues.LOCATION_INSTRUCTION)
                break
            case 'Transaction Type':
                setStep(stepArray.length === 4 ? 2 : 1)
                setTransactionValue()
                setInsurenePaid()
                setInstruction(constantValues.TRANSACTION_TYPE_INSTRUCTION)
                modalShowPortal.function(true, constantValues.TRANSACTION_TYPE_INSTRUCTION)
                break
        }

    }

    const onNoCallback = () => {
        setModalShowPortal({
            ...modalShowPortal,
            value: false,
        })
    }

    const onCollapseClick = (fn, id) => {
        setSelectedField(id)
        setModalShowPortal({
            ...modalShowPortal,
            value: true,
            function: fn
        })
    }

    const setEnableButton = (enableValue, value) => {
        setInsurenePaid(value)
        responseJson.selectedTransactionTypes = {
            ...responseJson.selectedTransactionTypes,
            salePrice: value?.salesPrice || '',
            loanAmount: value?.loanPrice || '',
            titleInsuranceOwner: value?.titlePaidBy?.titleInsuranceOptionDescription || '',
            titleInsuranceOwnerId: value?.titlePaidBy?.titleInsuranceOptionId || '',
            refinanceOptionId: value?.refinace?.refinanceOptionId || '',
            refinanceOption: value?.refinace?.refinanceOptionsDesc || '',
            refiCashOutAmount: value?.mortgagePrice || ''
        }
        setJsonResponse(responseJson)
        if (enableValue)
            setStep(stepArray.length === 4 ? 4 : 3)
        else
            setStep(stepArray.length === 4 ? 3 : 2)
        setButtonEnable(enableValue)
    }

    const onSubmitButton = () => {
        dispatch(getWithRawRequest(constantValues.BASE_URL1 + constantValues.INPUT_REQUEST, onInputSubmitSuccess,
            onInputSubmitFailure, loadingData, JSON.stringify(responseJson)))
    }

    useEffect(() => {
        if (response?.found) {
            history(
                `/quotesummary`,
                { state: { data: response.response.body, companyInfo: responseJson['titleCompanyInfo'] } }
            );
        }
    }, [JSON.stringify(response)])
    let rr
    const onStartOverClick = () => {
        // setModalShowPortal({
        //     ...modalShowPortal,
        //     value: false,
        // })
        // setBranchExpand(true)
        // setEnableButton(false)
        // getPageLoad()
        // setBranch()
        // setLocation()
        // setTransactionValue()
        // setInsurenePaid()
        // setStep(0)
        // setInstruction(constantValues.VIRTUAL_ASSISTANT)
        // modalShowPortal.function(true, constantValues.VIRTUAL_ASSISTANT)
    }

    return (
        <section className="title_quote_input">
            <img src={'/images/start_over.png'} className='start-over-input' onClick={onStartOverClick} />
            <div className="container">

                <Stepper step={step} stepArray={stepArray} />
                {
                    dropDownBranchOptions && (
                        <>
                            {
                                dropDownBranchOptions.length > 0 && <BranchComponent instruction={instruction} dropDownBranchOptions={dropDownBranchOptions} companyName={companyName} onBranchChange={onBranchChange} onCollapseClick={onCollapseClick} isBranchExpand={branchExpand} />
                            }

                            {
                                (branch || dropDownBranchOptions.length === 0) && (
                                    <>
                                        <LocationInput getLocation={getLocation} instruction={instruction} onCollapseClick={onCollapseClick} />
                                        {
                                            location?.location && (
                                                <>
                                                    {
                                                        <>
                                                            <TransactionType instruction={instruction} dropDownTransactionOptions={dropDownTransactionOptions} onTransactionValueChanged={onTransactionValueChanged}
                                                                onCollapseClick={onCollapseClick} />
                                                            {
                                                                transactionValue && <TitlePolicyPaid instruction={instruction} transactionValue={transactionValue?.transaction} setEnableButton={setEnableButton} />
                                                            }
                                                        </>
                                                    }
                                                </>
                                            )
                                        }
                                    </>
                                )
                            }
                        </>
                    )
                }
                {
                    isButtonEnable && (<button style={setSubmitButtonStyle()} onClick={onSubmitButton}>Calculate</button>)
                }
                {
                    <ConfirmationModalPortal modalContent={'Do you want to edit the field?'}
                        modalshow={modalShowPortal.value} onYesCallback={onYesCallback} onNoCallback={onNoCallback} />
                }
            </div>
        </section>
    )

}

export default InputScreen