import React, { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import '../sass/inputscreen.scss'
import { PostData, getWithRawRequest } from "../http/AsyncService"
import { constantValues } from "../utils/constants"
import { loadingData, onInputFailure, onInputSuccess, onInputSubmitSuccess, onInputSubmitFailure, loadingSubmitData } from "../redux/actioncreator/InputAction"
import LocationInput from "./LocationInput"
import Stepper from "../atomiccomponent/Stepper"
import ConfirmationModalPortal from "./ConfirmationModalPortal"
import { getColor, getStingOnLanguage, setColor, setLanguage, setSubmitButtonStyle, getStingOnAPILanguage } from '../utils/utility'
import BranchComponent from "./BranchComponent"
import TransactionType from "./TransactionType"
import TitlePolicyPaid from "./TitlePolicyPaid"
import { useNavigate, useLocation } from 'react-router'
import AlertModalPortal from "./AlertModalPortal"
import CustomSpinner from "../atomiccomponent/CustomSpinner"
import LoadingComp from "../atomiccomponent/LoadingComp"
import queryString from 'query-string'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

const InputScreen = ({ category }) => {
    const history = useNavigate()
    const reduxLocation = useLocation()
    const queries = queryString.parse(reduxLocation.search)
    const companyId = queries.companyid
    const languageId = queries.languageid || 'EN'
    setLanguage(languageId)
    const dispatch = useDispatch()
    const { companyBranchList, transactionTypesList, companyID, companyName, companyBGColor, ...otherValue } = useSelector(state => state?.input?.input)
    const { inputsubmit, loadingResponseData, loadingBlankScreen } = useSelector(state => state?.input)
    const [loader, setLoader] = useState({
        loadingResponseData: true,
        loadingBlankScreen: true,
        loadingBlankScreenSubmit: false
    })
    const response = inputsubmit
    const [dropDownBranchOptions, setDropDownBranchOptions] = useState([])
    const [dropDownTransactionOptions, setDropDownTransactionOptions] = useState([])
    const [transactionValue, setTransactionValue] = useState()
    const [branch, setBranch] = useState()
    const [insurencePaid, setInsurenePaid] = useState()
    const [instruction, setInstruction] = useState(getStingOnLanguage('VIRTUAL_ASSISTANT'))
    const [modalShowPortal, setModalShowPortal] = useState(false)
    const [alertModalShowPortal, setAlertModalShowPortal] = useState(false)
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
                return 'images/cash_transfer.png'
            case constantValues.TRANSACTION_TYPE_REFINANCE:
                return 'images/refinance.png'
            case constantValues.TRANSACTION_TYPE_REFINANCE_CASH_OUT:
                return 'images/refinancecashout.png'
            case constantValues.TRANSACTION_TYPE_PURCHASE_WITH_FINANCE:
                return 'images/purchasewithfinance.png'
        }
    }

    useEffect(() => {
        setLoader({
            ...loader,
            loadingResponseData: loadingResponseData,
            loadingBlankScreen: loadingBlankScreen
        })
    }, [loadingResponseData, loadingBlankScreen])

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
                    name: getStingOnAPILanguage(transaction, 'transactionTypeDescription'),
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
            data: {
                color: getColor(),
                title: companyName
            }
        })
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
        setInstruction(getStingOnLanguage('TRANSACTION_TYPE_INSTRUCTION'))
        setLocation({
            ...location

        })
        responseJson['propertyAddress'] = {
            ...location
        }
        delete responseJson['propertyAddress'].location
        //delete responseJson['propertyAddress'].condo
        delete responseJson['propertyAddress'].description
        setJsonResponse(responseJson)
    }

    const onBranchChange = (index) => {
        setInstruction(getStingOnLanguage('LOCATION_INSTRUCTION'))
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
                getStingOnLanguage('INSURENCE_PAID_INSTRUCTION_CASH_FINANCE') : getStingOnLanguage('INSURENCE_PAID_INSTRUCTION_OTHERS'))
            setTransactionValue(value)
            responseJson.selectedTransactionTypes = {}
            responseJson.selectedTransactionTypes.transactionTypeId = value.transaction.value
            responseJson.selectedTransactionTypes.transactionType = value.transaction.name

            setJsonResponse(responseJson)
        }
    }

    const getPageLoad = () => {
        const url = category? constantValues.INPUT_DETAILS_LE : constantValues.INPUT_DETAILS1
        const params = new URLSearchParams()
        params.append('companyId', companyId)

        dispatch(PostData(constantValues.BASE_URL1 + url, 'get', params, onInputSuccess,
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
                setInstruction(getStingOnLanguage('VIRTUAL_ASSISTANT'))
                modalShowPortal.function(true, getStingOnLanguage('VIRTUAL_ASSISTANT'))
                break
            case 'Location':
                setStep(stepArray.length === 4 ? 1 : 0)
                setLocation()
                setTransactionValue()
                setInsurenePaid()
                setInstruction(getStingOnLanguage('LOCATION_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('LOCATION_INSTRUCTION'))
                break
            case 'Transaction Type':
                setStep(stepArray.length === 4 ? 2 : 1)
                setTransactionValue()
                setInsurenePaid()
                setInstruction(getStingOnLanguage('TRANSACTION_TYPE_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('TRANSACTION_TYPE_INSTRUCTION'))
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
        const url = category? constantValues.INPUT_REQUEST_LE : constantValues.INPUT_REQUEST
        dispatch(getWithRawRequest(constantValues.BASE_URL1 + url, onInputSubmitSuccess,
            onInputSubmitFailure, loadingSubmitData, JSON.stringify(responseJson)))
    }

    useEffect(() => {
        if (response?.found) {
            history({
                pathname: `/quotesummary`,

                search: `?languageid=${languageId}&companyid=${companyId}`
            }, { state: { data: response.response.body, companyInfo: responseJson } })
        }
    }, [JSON.stringify(response)])
    const onStartOverClick = () => {
        setEnableButton(false)
        setBranch()
        setLocation()
        setTransactionValue()
        setInsurenePaid()
        setStep(0)
        setBranchExpand(true)
        setInstruction(getStingOnLanguage('VIRTUAL_ASSISTANT'))
    }

    const onLoanAmountCheck = () => {
        setAlertModalShowPortal(true)
    }

    const onOkCallback = () => {
        setAlertModalShowPortal(false)
    }

    return (
        <>
            <section className="title_quote_input">
                <span className='start-over-input' onClick={onStartOverClick} >{getStingOnLanguage('START_OVER')}</span>
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
                                                                    transactionValue && <TitlePolicyPaid instruction={instruction} transactionValue={transactionValue?.transaction} setEnableButton={setEnableButton} onLoanAmountCheck={onLoanAmountCheck}
                                                                        transacionValue={transactionValue} />
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
                        isButtonEnable && (<button style={setSubmitButtonStyle()} onClick={onSubmitButton}>{getStingOnLanguage('CALCULATE')}</button>)
                    }
                    {
                        <ConfirmationModalPortal modalContent={getStingOnLanguage('EDIT_CONFIRMATION_MESSAGE')} modalSubcontent={getStingOnLanguage('EDIT_CONFIRMATION_MESSAGE_SUBCONTENT')}
                            modalshow={modalShowPortal.value} onYesCallback={onYesCallback} onNoCallback={onNoCallback} />
                    }
                    {
                        <AlertModalPortal modalContent={getStingOnLanguage('ALERT_LOAN_AMOUNT_EXCEED_MESSAGE')} modalshow={alertModalShowPortal} onOkCallback={onOkCallback}
                        />
                    }
                </div>

            </section>

            {
                loader?.loadingResponseData && <LoadingComp />
            }
            {
                loader?.loadingBlankScreenSubmit && <LoadingComp />
            }
            {
                loader?.loadingResponseData && <CustomSpinner loadingData={loadingResponseData} />
            }
        </>
    )

}

export default InputScreen