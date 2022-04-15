import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import Stepper from "../atomiccomponent/Stepper"
import { getWithRawRequest, PostData } from '../http/AsyncService'
import { loadingData, onInputFailure, onInputSuccess, onInputSubmitSuccess, onInputSubmitFailure, loadingSubmitData } from '../redux/actioncreator/SellerNetSheetInputaction'
import { constantValues } from '../utils/constants'
import { getColor, getLanguage, getStingOnAPILanguage, getStingOnLanguage, setColor, setLanguage, setSubmitButtonStyle } from '../utils/utility'
import '../sass/inputscreen.scss'
import LocationInput from './LocationInput'
import SalesPrice from './SalesPrice'
import Mortgage from './Mortgage'
import Commission from './Commission'
import HOAComponent from './HOAComponent'
import PropertyTax from './PropertyTax'
import ConfirmationModalPortal from './ConfirmationModalPortal'
import BranchComponent from './BranchComponent'
import OtherExpenses from './OtherExpenses'
import queryString from 'query-string'
import LoadingComp from '../atomiccomponent/LoadingComp'
import CustomSpinner from '../atomiccomponent/CustomSpinner'

const SellerNetSheetInput = () => {
    const [step, setStep] = useState(0)
    const history = useNavigate()
    const reduxLocation = useLocation()
    const queries = queryString.parse(reduxLocation.search)
    const companyId = queries.companyid
    const languageId = queries.languageid || 'EN'
    setLanguage(languageId)
    const [dropDownBranchOptions, setDropDownBranchOptions] = useState([])
    const [instruction, setInstruction] = useState(getStingOnLanguage('SELLER_VIRTUAL_ASSISTANT'))
    const [branch, setBranch] = useState()
    const [commissionValue, setCommissionValue] = useState()
    const [mortgageValue, setMortgageValue] = useState()
    const [hoaValue, setHOAValue] = useState()
    const [propertyTaxValue, setPropertyTaxValue] = useState()
    const { companyBranchList, companyID, compRep, companyName, companyBGColor, defaultSalePrice, salesPriceDescription, salesPriceDescription_es, companyLogoURL,
        closingDateDescription, closingDateDescription_es, defaultClosingDate, titleInsurance, mortgage, agentCommission, hoa, propertyTax, otherExpenses, ...otherValue } = useSelector(state => state?.sellerinput?.input) || {}
    const { inputsubmit, loadingResponseData, loadingBlankScreen } = useSelector(state => state?.sellerinput)
    const response = inputsubmit
    console.log('loadingResponseData', loadingResponseData, loadingBlankScreen)
    const [responseJson, setJsonResponse] = useState({})
    const dispatch = useDispatch()
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
    let [isButtonEnable, setButtonEnable] = useState(false)
    const [location, setLocation] = useState()
    const [salePriceValue, setSalesPriceValue] = useState()
    const [stepArray, setStepArray] = useState(['images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png',
        'images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png'])
    const salesValue = useSelector(state => state?.sellerinput?.value)
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
                'images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png'])
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
    }, [companyID])

    useEffect(() => {
        setLoader({
            ...loader,
            loadingResponseData: loadingResponseData,
            loadingBlankScreen: loadingBlankScreen
        })
    }, [loadingResponseData, loadingBlankScreen])

    useEffect(() => {
        if (propertyTax?.propertyTaxOptionsList && propertyTax?.propertyTaxOptionsList[0]?.propertyTaxOptionDefaultValue !== 0 && propertyTax?.propertyTaxOptionsList[1]?.propertyTaxOptionDefaultValue !== 0 && !salePriceValue) {
            setStep(stepArray.length === 7 ? 3 : 2)
            setSalesPriceValue(salesValue)
            setInstruction(getStingOnLanguage('MORTGAGE_INSTRUCTION'))
        }

    }, [JSON.stringify(propertyTax)])

    useEffect(() => {
        if (response?.found) {
            history({
                pathname: '/sellernetsheetsummary',
                search: `?languageid=${languageId}&companyid=${companyId}`
            }, { state: { data: response.response.body, companyInfo: responseJson } })
        }
    }, [JSON.stringify(response)])

    const calculateListingAgentCommission = (amount, id) => {
        if (id === constantValues.LISTING_THREE_PERCENTAGE_COMMISSION_ID || id === constantValues.LISTING_CUSTOM_COMMISSION_RATE_ID) {
            return ((parseFloat(salePriceValue.currency) * parseFloat(amount)) / 100)
        } else {
            return amount
        }
    }

    const calculateBuyerAgentCommission = (amount, id) => {
        if (id === constantValues.BUYER_THREE_PERCENTAGE_COMMISSION_ID || id === constantValues.BUYER_CUSTOM_COMMISSION_RATE_ID) {
            return ((parseFloat(salePriceValue.currency) * parseFloat(amount)) / 100)
        } else {
            return amount
        }
    }

    const getCommissionValue = (value) => {
        console.log('commission value-->', value, responseJson, salePriceValue)
        if (!['', '0'].includes(value.buyerAmount) && value.buyerId && !['', '0'].includes(value.lisitingAmount) && value.listingId) {
            setStep(stepArray.length === 7 ? 5 : 4)
            setCommissionValue({
                ...commissionValue,
                value
            })
            setInstruction(getStingOnLanguage('HOA_INSTRUCTION'))
        } else {
            setCommissionValue()
        }
        responseJson['selectedTransactionTypes'] = {
            ...responseJson.selectedTransactionTypes,
            listingAgentCommission: calculateListingAgentCommission(value.lisitingAmount, value.listingId).toString(),
            listingAgentCommissionId: value.listingId,
            buyerAgentCommission: calculateBuyerAgentCommission(value.buyerAmount, value.buyerId).toString(),
            buyerAgentCommissionId: value.buyerId
        }
        //setJsonResponse(responseJson)
        console.log('commission value11-->', value, responseJson)
    }

    useEffect(() => {
        const params = new URLSearchParams()
        params.append('companyId', companyId)
        dispatch(PostData(constantValues.BASE_URL1 + constantValues.SELLER_NET_SHEET_INPUT_DETAILS, 'get', params, onInputSuccess,
            onInputFailure, loadingData))
    }, [])

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

    const getLocation = (location) => {
        // const params = new URLSearchParams()
        // params.append('companyId', companyId)
        // dispatch(PostData(constantValues.BASE_URL1 + constantValues.SELLER_NET_SHEET_INPUT_DETAILS, 'get', params, onInputSuccess,
        //     onInputFailure, loadingData))
        setStep(stepArray.length === 7 ? 2 : 1)
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
        //setJsonResponse(responseJson)
    }

    const onSalesPriceValue = (value) => {
        console.log('valuee->', value)
        if (value.currency && value.insuPaid) {
            const params = new URLSearchParams()
            params.append('companyId', companyId)
            params.append('countyName', location.administrative_area_level_2)
            params.append('state', location.state)
            params.append('salePrice', value.currency)
            dispatch(PostData(constantValues.BASE_URL1 + constantValues.SELLER_NET_SHEET_NEXT_INPUT_DETAILS, 'get', params, onInputSuccess,
                onInputFailure, loadingData, undefined, value))
        }
        responseJson['selectedTransactionTypes'] = {
            salePrice: value.currency,
            titleInsuranceOwner: getStingOnAPILanguage(titleInsurance?.titleInsuranceOptionsList[value.index], 'titleInsuranceOptionDescription'),
            titleInsuranceOwnerId: value.insuPaid,
            defaultClosingDate: value.date
        }
        //setJsonResponse(responseJson)
    }

    const onMortgageValue = (value) => {
        console.log('mortgage-->', value, responseJson)
        if (value && (value.inpvalue.length > 0 && !value.inpvalue.includes('') && !value.inpvalue.includes('0') && value.mort !== '') ||
            (value.inpvalue.length === 0 && value.mort !== '')) {
            setStep(stepArray.length === 7 ? 4 : 3)
            setMortgageValue(value)
            setInstruction(getStingOnLanguage('COMMISSION_INSTRUCTION'))
        } else {
            setMortgageValue()
        }

        responseJson['selectedTransactionTypes'] = {
            ...responseJson.selectedTransactionTypes,
            primaryMortgage: value.inpvalue[0] || '0',
            secondaryMortage: value.inpvalue[1] || '0'
        }
        responseJson['selectedTransactionTypes'].outstandingMortgageAmount = parseFloat(responseJson['selectedTransactionTypes'].primaryMortgage) +
            parseFloat(responseJson['selectedTransactionTypes'].secondaryMortage) + ''
    }

    const getHOADetails = (value) => {
        console.log('hoa value-->', value, responseJson)
        if (value.hoaValue === '1' || (value.hoaValue !== '' && value.hoaAmount !== '' && value.hoaSellerPaid !== '')) {
            setStep(stepArray.length === 7 ? 6 : 5)
            setHOAValue(value)
            setInstruction(getStingOnLanguage('PROPERTY_TAX_INSTRUCTION'))
        } else {
            setHOAValue()
        }
        responseJson['selectedHOA'] = {
            hoaOptionId: value.hoaValue,
            hoaOptionDescription: getStingOnAPILanguage(hoa?.hoaOptionsList[value.hoaIndex], 'hoaOptionDescription'),
            hoaOptionAmount: value.hoaAmount,
            hoaDuePaidBySeller: value.index ? value.sellerPayDueHOAOptions[value.index].value === constantValues.YES_HOA_DUE_ID : false
        }
        console.log('responseJson', responseJson)
    }

    const getPropertyTax = (value) => {
        console.log('getPropertyTax', value)
        if (value && value.ptaxId !== '' && !['0', ''].includes(value.ptaxAmount.value)) {
            setStep(stepArray.length === 7 ? 7 : 6)
            setPropertyTaxValue(value)
            setInstruction(getStingOnLanguage('OTHER_INFO_INSTRUCTION'))
        } else {
            setPropertyTaxValue()
        }
        responseJson['selectedTransactionTypes'] = {
            ...responseJson.selectedTransactionTypes,
            propertyTaxRate: value.ptaxId === constantValues.PROPERTY_TAX_RATE_ID ? value.ptaxAmount.value : '',
            propertyTaxValue: value.ptaxId === constantValues.PROPERTY_TAX_AMOUNT_ID ? value.ptaxAmount.value : '',
            propertyTaxId: value.ptaxId
        }
        console.log('responseJson', responseJson)
    }

    const onCollapseClick = (fn, id) => {
        setSelectedField(id)
        setModalShowPortal({
            ...modalShowPortal,
            value: true,
            function: fn
        })
    }

    const onYesCallback = () => {
        setModalShowPortal({
            ...modalShowPortal,
            value: false,
        })
        setButtonEnable(false)
        switch (selectedField) {
            case 'Branch-DropDown':
                setBranch()
                setLocation()
                setSalesPriceValue()
                setMortgageValue()
                setCommissionValue()
                setHOAValue()
                setPropertyTaxValue()
                setStep(0)
                setInstruction(getStingOnLanguage('SELLER_VIRTUAL_ASSISTANT'))
                modalShowPortal.function(true, getStingOnLanguage('SELLER_VIRTUAL_ASSISTANT'))
                break
            case 'Location':
                setLocation()
                setSalesPriceValue()
                setMortgageValue()
                setCommissionValue()
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 1 : 0)
                setInstruction(getStingOnLanguage('SELLER_LOCATION_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('SELLER_LOCATION_INSTRUCTION'))
                break
            case 'Sales Price':
                setSalesPriceValue()
                setMortgageValue()
                setCommissionValue()
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 2 : 1)
                setInstruction(getStingOnLanguage('TRANSACTION_TYPE_INSTRUCTION'))
                const params = new URLSearchParams()
                params.append('companyId', companyId)
                dispatch(PostData(constantValues.BASE_URL1 + constantValues.SELLER_NET_SHEET_INPUT_DETAILS, 'get', params, onInputSuccess,
                    onInputFailure, loadingData))
                modalShowPortal.function(true, getStingOnLanguage('TRANSACTION_TYPE_INSTRUCTION'))
                break
            case 'Mortgage':
                setMortgageValue()
                setCommissionValue()
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 3 : 2)
                setInstruction(getStingOnLanguage('MORTGAGE_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('MORTGAGE_INSTRUCTION'))
                break
            case 'Commission':
                setCommissionValue()
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 4 : 3)
                setInstruction(getStingOnLanguage('COMMISSION_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('COMMISSION_INSTRUCTION'))
                break
            case 'HOA':
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 5 : 4)
                setInstruction(getStingOnLanguage('HOA_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('HOA_INSTRUCTION'))
                break
            case 'PTax':
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 6 : 5)
                setInstruction(getStingOnLanguage('PROPERTY_TAX_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('PROPERTY_TAX_INSTRUCTION'))
                break
        }

    }

    const onNoCallback = () => {
        setModalShowPortal({
            ...modalShowPortal,
            value: false,
        })
    }

    const setEnableButton = (enableValue, id) => {
        setButtonEnable(salePriceValue)
    }

    const getOtherExpense = (otherExpense) => {
        responseJson['otherExpenses'].push(otherExpense)
        console.log('otherExpense', responseJson)
    }

    const onSubmitButton = () => {
        console.log('response--->', responseJson)
        const url = constantValues.INPUT_REQUEST_SELLER
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
                                                            <SalesPrice defaultValue={defaultSalePrice} labelText={getLanguage().toLowerCase() === 'es' ? salesPriceDescription_es : salesPriceDescription} dateDefaultValue={defaultClosingDate}
                                                                dateLabelText={getLanguage().toLowerCase() === 'es' ? closingDateDescription_es : closingDateDescription}
                                                                instruction={instruction} titleInsurance={titleInsurance} onSalesPriceValue={onSalesPriceValue} onCollapseClick={onCollapseClick} />
                                                            {
                                                                salePriceValue && (
                                                                    <>
                                                                        <Mortgage mortgage={mortgage} onMortgageValue={onMortgageValue} instruction={instruction} onCollapseClick={onCollapseClick} />
                                                                        {
                                                                            mortgageValue && (
                                                                                <>
                                                                                    <Commission commission={agentCommission} getCommissionValue={getCommissionValue} instruction={instruction} onCollapseClick={onCollapseClick} />
                                                                                    {
                                                                                        commissionValue && (
                                                                                            <>
                                                                                                <HOAComponent hoa={hoa} instruction={instruction} getHOADetails={getHOADetails} onCollapseClick={onCollapseClick} />
                                                                                                {
                                                                                                    hoaValue && propertyTax && (
                                                                                                        <>
                                                                                                            <PropertyTax propertyTax={propertyTax} instruction={instruction} getPropertyTax={getPropertyTax} onCollapseClick={onCollapseClick} setEnableButton={setEnableButton} />
                                                                                                            {
                                                                                                                propertyTaxValue && otherExpenses && <OtherExpenses otherExpenses={otherExpenses} instruction={instruction} getOtherExpense={getOtherExpense} />
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
                    isButtonEnable && (<button style={setSubmitButtonStyle()} onClick={onSubmitButton}>{getStingOnLanguage('CALCULATE')}</button>)
                }

                {
                    <ConfirmationModalPortal modalContent={constantValues.EDIT_FIELD}
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

export default React.memo(SellerNetSheetInput)