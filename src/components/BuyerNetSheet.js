import React, { useEffect, useState } from 'react'
import { constantValues } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { loadingData, loadingSubmitData, onInputFailure, onInputSubmitFailure, onInputSubmitSuccess, onInputSuccess } from '../redux/actioncreator/SellerNetSheetInputaction'
import { getWithRawRequest, PostData } from '../http/AsyncService'
import '../sass/buyernetsheet.scss'
import '../sass/inputscreen.scss'
import Stepper from '../atomiccomponent/Stepper'
import { getColor, getStingOnAPILanguage, getStingOnLanguage, setColor, setLanguage } from '../utils/utility'
import BranchComponent from './BranchComponent'
import LocationInput from './LocationInput'
import SalesPriceWithTransaction from './SalesPriceWithTransaction'
import LoanType from './LoanType'
import HomeInsurence from './HomeInsurence'
import HOAComponent from './HOAComponent'
import PropertyTax from './PropertyTax'
import LenderFees from './LenderFees'
import OtherExpenses from './OtherExpenses'
import ConfirmationModalPortal from './ConfirmationModalPortal'
import queryString from 'query-string'
import LoadingComp from '../atomiccomponent/LoadingComp'
import CustomSpinner from '../atomiccomponent/CustomSpinner'
import * as moment from 'moment'

const BuyerNetSheet = () => {
    const dispatch = useDispatch()
    const history = useNavigate()
    const reduxLocation = useLocation()
    const queries = queryString.parse(reduxLocation.search)
    const companyId = queries.companyid
    const languageId = queries.languageid || 'EN'
    const [responseJson, setJsonResponse] = useState({})
    setLanguage(languageId)
    const [step, setStep] = useState(0)
    const [dropDownBranchOptions, setDropDownBranchOptions] = useState([])
    const [instruction, setInstruction] = useState(getStingOnLanguage('VIRTUAL_ASSISTANT'))
    const [stepArray, setStepArray] = useState(['images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/AmountWorkflowStep.png', 'images/mortgageWorkflowStep.png',
        'images/HomeInsurance.png', 'images/hoaWorkflowStep.png', 'images/propertyTaxWorkflowStep.png', 'images/PriceTagWorkflowStep.png'])
    const { hoa, companyBranchList, companyID, compRep, companyName, companyLogoURL, companyBGColor, defaultSalePrice, salesPriceDescription,
        closingDateDescription, defaultClosingDate, transactionTypesList, mortgage, commission, propertyTax, otherExpenses, loanType,
        homeInsurance, lenderCost, ...otherValue } = useSelector(state => state?.sellerinput?.input) || {}
    const { inputsubmit, loadingResponseData, loadingBlankScreen } = useSelector(state => state?.sellerinput)
    const response = inputsubmit
    const [branch, setBranch] = useState()
    const [selectedField, setSelectedField] = useState('')
    const [modalShowPortal, setModalShowPortal] = useState({
        value: false,
        function: {}
    })
    const [loader, setLoader] = useState({
        loadingResponseData: true,
        loadingBlankScreen: true,
        loadingBlankScreenSubmit: false
    })
    const [location, setLocation] = useState()
    const [salePriceValue, setSalesPriceValue] = useState()
    const [loanTypeValue, setLoanTypeValue] = useState()
    const [homeInsurenceValue, setHomeInsurenceValue] = useState()
    const [hoaValue, setHOAValue] = useState()
    const [propertyTaxValue, setPropertyTaxValue] = useState()
    const [lenderFeesValue, setLenderFeesValue] = useState()
    let [isButtonEnable, setButtonEnable] = useState(false)
    let [otherExpenseList, setOtherExpenseList] = useState([])
    const salesValue = useSelector(state => state?.sellerinput?.value)


    useEffect(() => {
        if (response?.found) {
            history({
                pathname: '/buyernetsheetsummary',
                search: `?languageid=${languageId}&companyid=${companyId}`
            }, { state: { data: response.response.body, companyInfo: responseJson } })
        }
    }, [JSON.stringify(response)])


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
                setSalesPriceValue()
                setLoanTypeValue()
                setHomeInsurenceValue()
                setHOAValue()
                setPropertyTaxValue()
                setLenderFeesValue()
                setStep(0)
                setInstruction(getStingOnLanguage('VIRTUAL_ASSISTANT'))
                modalShowPortal.function(true, getStingOnLanguage('VIRTUAL_ASSISTANT'))
                break
            case 'Location':
                setLocation()
                setSalesPriceValue()
                setLoanTypeValue()
                setHomeInsurenceValue()
                setHOAValue()
                setPropertyTaxValue()
                setLenderFeesValue()
                setStep(stepArray.length === 8 ? 1 : 0)
                setInstruction(getStingOnLanguage('SELLER_LOCATION_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('SELLER_LOCATION_INSTRUCTION'))
                break
            case 'Sales Price':
                setSalesPriceValue()
                setLoanTypeValue()
                setHomeInsurenceValue()
                setHOAValue()
                setPropertyTaxValue()
                setLenderFeesValue()
                setStep(stepArray.length === 8 ? 2 : 1)
                setInstruction(getStingOnLanguage('TRANSACTION_TYPE_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('TRANSACTION_TYPE_INSTRUCTION'))
                break
            case 'LoanType':
                setLoanTypeValue()
                setHomeInsurenceValue()
                setHOAValue()
                setPropertyTaxValue()
                setLenderFeesValue()
                setStep(stepArray.length === 8 ? 3 : 2)
                setInstruction(getStingOnLanguage('LOAN_TYPE_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('LOAN_TYPE_INSTRUCTION'))
                break
            case 'HomeInsurence':
                setHomeInsurenceValue()
                setHOAValue()
                setPropertyTaxValue()
                setLenderFeesValue()
                setStep(stepArray.length === 8 ? 4 : stepArray.length === 5 ? 2 : 3)
                setInstruction(getStingOnLanguage('HOME_INSURENCE_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('HOME_INSURENCE_INSTRUCTION'))
                break
            case 'HOA':
                setHOAValue()
                setPropertyTaxValue()
                setLenderFeesValue()
                setStep(stepArray.length === 8 ? 5 : stepArray.length === 5 ? 3 : 4)
                setInstruction(getStingOnLanguage('HOA_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('HOA_INSTRUCTION'))
                break
            case 'PTax':
                setPropertyTaxValue()
                setLenderFeesValue()
                setStep(stepArray.length === 8 ? 7 : 6)
                setInstruction(getStingOnLanguage('PROPERTY_TAX_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('PROPERTY_TAX_INSTRUCTION'))
                break
            case 'LenderFees':
                setLenderFeesValue()
                setStep(stepArray.length === 8 ? 8 : 7)
                setInstruction(getStingOnLanguage('OTHER_INFO_BUYER_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('OTHER_INFO_BUYER_INSTRUCTION'))
                break
        }

    }

    const onNoCallback = () => {
        setModalShowPortal({
            ...modalShowPortal,
            value: false,
        })
    }

    useEffect(() => {
        const params = new URLSearchParams()
        params.append('companyId', '10000')
        dispatch(PostData(constantValues.BASE_URL1 + constantValues.BUYER_NET_SHEET_INPUT_DETAILS, 'get', params, onInputSuccess,
            onInputFailure, loadingData))
    }, [])

    useEffect(() => {
        setSalesPriceValue(salesValue)
    }, [salesValue])

    useEffect(() => {
        if (propertyTax?.propertyTaxOptionsList && propertyTax?.propertyTaxOptionsList[0]?.propertyTaxOptionDefaultValue !== 0 && propertyTax?.propertyTaxOptionsList[1]?.propertyTaxOptionDefaultValue !== 0 && !salePriceValue) {
            setStep(companyBranchList?.length !== 0 ? 3 : 2)
            setSalesPriceValue(salesValue)
            setInstruction(salesValue.transactionType !== constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID ?
                getStingOnLanguage('LOAN_TYPE_INSTRUCTION') : getStingOnLanguage('HOME_INSURENCE_INSTRUCTION'))
            let workFlowArr = ['images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png',
                'images/mortgageWorkflowStep.png', 'images/HomeInsurance.png', 'images/hoaWorkflowStep.png',
                'images/propertyTaxWorkflowStep.png', 'images/PriceTagWorkflowStep.png']
            if (salesValue.transactionType === constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID) {
                workFlowArr = ['images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png',
                    'images/HomeInsurance.png', 'images/hoaWorkflowStep.png', 'images/propertyTaxWorkflowStep.png']
            }
            if (companyBranchList?.length === 0) {
                workFlowArr.splice(0, 1)
            }
            setStepArray(workFlowArr)
        }

    }, [JSON.stringify(propertyTax)])

    useEffect(() => {
        setLoader({
            ...loader,
            loadingResponseData: loadingResponseData,
            loadingBlankScreen: loadingBlankScreen
        })
    }, [loadingResponseData, loadingBlankScreen])

    useEffect(() => {
        otherExpenseList = []
        if (otherExpenses?.otherExpensesOptionList?.length > 0) {
            for (let expense of otherExpenses?.otherExpensesOptionList) {
                otherExpenseList.push(expense)
            }
            setOtherExpenseList(otherExpenseList)
        }
    }, [JSON.stringify(otherExpenses)])

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
            setStepArray(['images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png',
                'images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png',
                'images/AddressWorkflowStep.png'])
        }
        companyBGColor && setColor(companyBGColor)
        dispatch({
            type: 'SET_COLOR',
            data: {
                color: getColor(),
                title: companyName,
                logo: companyLogoURL
            }
        })
        responseJson['titleCompanyInfo'] = {
            companyName,
            companyId: companyID,
            companyBGColor,
            companyLogoURL: companyLogoURL,
            companyFontColor: otherValue.companyFontColor,
            companyFontStyle: otherValue.companyFontStyle,
        }
        responseJson['propertyAddress'] = {}
        responseJson['selectedTransactionTypes'] = {}
        responseJson['otherExpenses'] = []
        responseJson['loanDetails'] = {}
        responseJson['lenderFees'] = []
    }, [companyID])

    const onBranchChange = (index) => {
        setInstruction(getStingOnLanguage('SELLER_LOCATION_INSTRUCTION'))
        setStep(1)
        if (branch !== dropDownBranchOptions[index].value) {
            setBranch({
                details: dropDownBranchOptions[index],
                index: index
            })
        }
        responseJson.titleCompanyInfo['companyBranchName'] = dropDownBranchOptions[index].companyBranchName
        responseJson.titleCompanyInfo['companyBranchId'] = dropDownBranchOptions[index].companyBranchId

    }

    const onCollapseClick = (fn, id) => {
        setSelectedField(id)
        setModalShowPortal({
            ...modalShowPortal,
            value: true,
            function: fn
        })
    }

    const getLocation = (location) => {
        setStep(companyBranchList?.length !== 0 ? 2 : 1)
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
    }

    const onSalesPriceValue = (value) => {
        if (value.currency && value.insuPaid) {
            const params = new URLSearchParams()
            params.append('companyId', companyId)
            params.append('countyName', location.administrative_area_level_2)
            params.append('state', location.state)
            params.append('salePrice', value.currency)
            dispatch(PostData(constantValues.BASE_URL1 + constantValues.BUYER_NET_SHEET_NEXT_INPUT_DETAILS, 'get', params, onInputSuccess,
                onInputFailure, loadingData, undefined, value))
        }
        responseJson['selectedTransactionTypes'] = {
            salePrice: value.currency,
            titleInsuranceOwner: value.insuPaidOwner,
            titleInsuranceOwnerId: value.insuPaid,
            defaultClosingDate: moment(new Date(value.date)).format('MM/DD/YYYY')   ,
            transactionType: value.transactionType,
            transactionTypeName: value.transactionTypeName
        }

    }

    const onLoanTypeValue = (value) => {
        const downPaymnt = value.loantype === constantValues.LOAN_STANDARD_20_PERCENTAGE_ID.toString() || value.loantype === constantValues.LOAN_CUSTOM_PERCENTAGE_ID.toString() ?
            (parseFloat(salePriceValue.currency) * parseFloat(value.downpaymentamount)) / 100 : value.downpaymentamount
        setStep(companyBranchList?.length !== 0 ? 4 : 3)
        setLoanTypeValue(value)
        setInstruction(getStingOnLanguage('HOME_INSURENCE_INSTRUCTION'))
        console.log('value-->', value)
        responseJson['loanDetails'] = {
            id: value.loantype,
            description: value.loanValue,
            downpayment: downPaymnt.toString(),
            loanTerm: value.loantermvalue,
            interestRate: value.interestrate,
            pmi: value.pmirate || '',
            vaFundingFee: parseInt(value.fundingfee),
            mipMonthlyRate: value.miprate || '',
            isMipFinanced: value.mipinsurence === constantValues.LOAN_MIP_FINANCE_YES,
            mipMonthlyRate: value.miprate
        }
        const downPaymentId = value.downpaymentid
        let loanAmount
        if (downPaymentId === constantValues.LOAN_STANDARD_20_PERCENTAGE_ID.toString() || downPaymentId === constantValues.LOAN_CUSTOM_PERCENTAGE_ID.toString()) {
            loanAmount = parseFloat(salePriceValue.currency) - (parseFloat(salePriceValue.currency) * parseFloat(value.downpaymentamount)) / 100
        } else {
            loanAmount = parseFloat(salePriceValue.currency) - parseFloat(value.downpaymentamount)
        }
            responseJson['selectedTransactionTypes'] = {
                ...responseJson.selectedTransactionTypes,
                loanAmount: loanAmount.toString()
        }
    }

    const onHIValue = (value) => {
        setStep(stepArray.length === 8 ? 5 : stepArray.length === 5 ? 3 : 4)
        // setStep(stepArray.length === 7 ? 5 : 4)
        setHomeInsurenceValue(value)
        setInstruction(getStingOnLanguage('HOA_INSTRUCTION'))
        responseJson['selectedTransactionTypes'] = {
            ...responseJson.selectedTransactionTypes,
            homeInsurnce: value
        }
    }

    const getHOADetails = (value) => {
        if (value.hoaValue === '1' || (value.hoaValue !== '' && value.hoaAmount !== '' && value.hoaSellerPaid !== '')) {
            setStep(stepArray.length === 8 ? 6 : stepArray.length === 5 ? 4 : 5)
            //setStep(stepArray.length === 8 ? 6 : 5)
            setHOAValue(value)
            setInstruction(getStingOnLanguage('PROPERTY_TAX_INSTRUCTION'))
        } else {
            setHOAValue()
        }

        if (responseJson['selectedHOA']?.hoaDuePaidBySeller)
            delete responseJson['selectedHOA'].hoaDuePaidBySeller
        responseJson['selectedHOA'] = {
            hoaOptionId: value.hoaValue,
            hoaOptionDescription: getStingOnAPILanguage(hoa?.hoaOptionsList[value.hoaIndex], 'hoaOptionDescription'),
            hoaOptionAmount: value.hoaAmount,
            // hoaDuePaidBySeller: value.sellerPayDueHOAOptions[value.index].value === constantValues.YES_HOA_DUE_ID
        }
        if (value.hoaValue !== constantValues.NO_HOA_ID.toString()) {
            responseJson['selectedHOA'].hoaDuePaidBySeller = value.sellerPayDueHOAOptions[value.index].value === constantValues.YES_HOA_DUE_ID
        }
    }

    const getPropertyTax = (value) => {
        if (value && value.ptaxId !== '' && !['0', ''].includes(value.ptaxAmount.value)) {
            setStep(stepArray.length === 8 ? 7 : 6)
            setPropertyTaxValue(value)
            setInstruction(salePriceValue.transactionType !== constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID ?
                getStingOnLanguage('LENDER_FEES_INSTRUCTION') : getStingOnLanguage('OTHER_INFO_BUYER_INSTRUCTION'))
        } else {
            setPropertyTaxValue()
        }

        responseJson['selectedTransactionTypes'] = {
            ...responseJson.selectedTransactionTypes,
            propertyTaxRate: value.ptaxId === constantValues.PROPERTY_TAX_RATE_ID ? value.ptaxAmount.value : '',
            propertyTaxValue: value.ptaxId === constantValues.PROPERTY_TAX_AMOUNT_ID ? value.ptaxAmount.value : '',
            propertyTaxId: value.ptaxId
        }
    }

    const onLenderFeesValue = (value) => {
        const updatedValue = value.map(val => (
            {
                feeId: val.id.toString(),
                description: val.desc,
                amount: val.defaultValue
            }
        ))
        responseJson['lenderFees'] = updatedValue
        setLenderFeesValue(value)
        setInstruction(getStingOnLanguage('OTHER_INFO_BUYER_INSTRUCTION'))
        setStep(stepArray.length === 8 ? 8 : 7)
    }

    const setEnableButton = (enableValue, id) => {
        if (salePriceValue.transactionType !== constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID) {
            setButtonEnable(id === 'LenderFee')
        } else {
            setButtonEnable(id === 'PropertyTax')
        }
    }

    const setSubmitButtonStyle = () => ({
        backgroundColor: getColor()
    })

    const getOtherExpense = (otherExpense) => {
        otherExpenseList = otherExpenseList.map((expense) => {

            if (expense.otherExpensesOptionId.toString() === otherExpense.otherExpensesOptionID) {
                expense.otherExpensesOptionDefaultValue = otherExpense.otherExpensesOptionDefaultValue
                expense.otherExpensesOptionLabel = otherExpense.otherExpensesOptionLabel
                expense.otherExpensesOptionID = otherExpense.otherExpensesOptionID
            }

            return expense
        })
        setOtherExpenseList(otherExpenseList)
        responseJson.otherExpenses = otherExpenseList
    }

    const onSubmitButton = () => {
        const url = constantValues.INPUT_REQUEST_BUYER
        dispatch(getWithRawRequest(constantValues.BASE_URL1 + url, onInputSubmitSuccess,
            onInputSubmitFailure, loadingSubmitData, JSON.stringify(responseJson)))
    }

    return (
        <section className="title_quote_input">
            <div className="container">
                <Stepper step={step} stepArray={stepArray} />
                {
                    dropDownBranchOptions && (
                        <>
                            {
                                dropDownBranchOptions.length > 0 && <BranchComponent instruction={instruction} dropDownBranchOptions={dropDownBranchOptions} companyName={companyName} onBranchChange={onBranchChange} onCollapseClick={onCollapseClick} />
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
                                                            <SalesPriceWithTransaction defaultValue={defaultSalePrice} labelText={salesPriceDescription} dateDefaultValue={defaultClosingDate} dateLabelText={closingDateDescription}
                                                                instruction={instruction} onSalesPriceValue={onSalesPriceValue} onCollapseClick={onCollapseClick} purchaseType={transactionTypesList} />
                                                            {
                                                                salePriceValue && (
                                                                    <>
                                                                        {
                                                                            salePriceValue.transactionType !== constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID && <LoanType instruction={instruction} loanType={loanType} salesprice={salePriceValue?.currency} onCollapseClick={onCollapseClick}
                                                                                onLoanTypeValue={onLoanTypeValue} />
                                                                        }

                                                                        {
                                                                            (salePriceValue.transactionType === constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID || loanTypeValue) && (
                                                                                <>
                                                                                    <HomeInsurence instruction={instruction} homeInsurance={homeInsurance} onHIValue={onHIValue} onCollapseClick={onCollapseClick} />
                                                                                    {
                                                                                        homeInsurenceValue && (
                                                                                            <>
                                                                                                <HOAComponent hoa={hoa} instruction={instruction} getHOADetails={getHOADetails} onCollapseClick={onCollapseClick} />
                                                                                                {
                                                                                                    hoaValue && propertyTax && (
                                                                                                        <>
                                                                                                            <PropertyTax propertyTax={propertyTax} instruction={instruction} getPropertyTax={getPropertyTax} onCollapseClick={onCollapseClick} setEnableButton={setEnableButton} />
                                                                                                            {

                                                                                                                propertyTaxValue && (
                                                                                                                    <>
                                                                                                                        {
                                                                                                                            salePriceValue.transactionType.toString() !== constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID &&
                                                                                                                            <LenderFees instruction={instruction} lenderCost={lenderCost} onLenderFeesValue={onLenderFeesValue} onCollapseClick={onCollapseClick}
                                                                                                                                setEnableButton={setEnableButton} />
                                                                                                                        }

                                                                                                                        {
                                                                                                                            (salePriceValue.transactionType === constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID || lenderFeesValue) && <OtherExpenses otherExpenses={otherExpenses} instruction={instruction}
                                                                                                                                getOtherExpense={getOtherExpense} />
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
                                                                                </>
                                                                            )
                                                                        }
                                                                    </>
                                                                )
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
                    <ConfirmationModalPortal modalContent={getStingOnLanguage('EDIT_FIELD')}
                        modalshow={modalShowPortal.value} onYesCallback={onYesCallback} onNoCallback={onNoCallback} />
                }
            </div>
            {
                loader?.loadingResponseData && <LoadingComp />
            }
            {
                loader?.loadingBlankScreenSubmit && <LoadingComp />
            }
            {
                loader?.loadingResponseData && <CustomSpinner loadingData={loadingResponseData} />
            }
        </section>
    )
}

export default BuyerNetSheet