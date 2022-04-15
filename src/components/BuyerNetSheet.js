import React, { useEffect, useState } from 'react'
import { constantValues } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { loadingData, onInputFailure, onInputSuccess } from '../redux/actioncreator/SellerNetSheetInputaction'
import { PostData } from '../http/AsyncService'
import '../sass/buyernetsheet.scss'
import '../sass/inputscreen.scss'
import Stepper from '../atomiccomponent/Stepper'
import { getColor, getStingOnLanguage, setColor } from '../utils/utility'
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

const BuyerNetSheet = () => {
    const dispatch = useDispatch()
    const [step, setStep] = useState(0)
    const [dropDownBranchOptions, setDropDownBranchOptions] = useState([])
    const [instruction, setInstruction] = useState(getStingOnLanguage('VIRTUAL_ASSISTANT'))
    const [stepArray, setStepArray] = useState(['images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png',
        'images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/BranchWorkflowStep.png'])
    const { companyBranchList, companyID, compRep, companyName, companyLogoURL, companyBGColor, defaultSalesPrice, salesPriceDescription,
        ClosingDateDescription, defaultClosingDate, titleInsurance, mortgage, commission, HOA, propertyTax, otherExpenses, purchaseType, loanType,
        homeInsurance, lenderCost } = useSelector(state => state?.sellerinput?.input) || {}
        console.log('pppp',companyID )
    const [branch, setBranch] = useState()
    const [selectedField, setSelectedField] = useState('')
    const [modalShowPortal, setModalShowPortal] = useState({
        value: false,
        function: {}
    })
    const [location, setLocation] = useState()
    const [salePriceValue, setSalesPriceValue] = useState()
    const [loanTypeValue, setLoanTypeValue] = useState()
    const [homeInsurenceValue, setHomeInsurenceValue] = useState()
    const [hoaValue, setHOAValue] = useState()
    const [propertyTaxValue, setPropertyTaxValue] = useState()
    const [lenderFeesValue, setLenderFeesValue] = useState()
    let [isButtonEnable, setButtonEnable] = useState(false)

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
                setInstruction(getStingOnLanguage('LOCATION_INSTRUCTION'))
                modalShowPortal.function(true, getStingOnLanguage('LOCATION_INSTRUCTION'))
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
        params.append('companyID', '111')
        dispatch(PostData(constantValues.BASE_URL + constantValues.BUYER_NET_SHEET_INPUT_DETAILS, 'get', params, onInputSuccess,
            onInputFailure, loadingData))
    }, [])

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
    }, [companyID])

    const onBranchChange = (index) => {
        setInstruction(getStingOnLanguage('LOCATION_INSTRUCTION'))
        setStep(1)
        if (branch !== dropDownBranchOptions[index].value) {
            setBranch({
                details: dropDownBranchOptions[index],
                index: index
            })
        }

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
    }

    const onSalesPriceValue = (value) => {
        if (value.currency && value.insuPaid) {
            setStep(companyBranchList?.length !== 0 ? 3 : 2)
            setSalesPriceValue(value)
            setInstruction(value.transactionType !== constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID ?
                getStingOnLanguage('LOAN_TYPE_INSTRUCTION') : getStingOnLanguage('HOME_INSURENCE_INSTRUCTION'))
            let workFlowArr = ['images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png',
                'images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png',
                'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png']
            if (value.transactionType === constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID) {
                workFlowArr = ['images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png',
                    'images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png']
            }
            if (companyBranchList?.length === 0) {
                workFlowArr.splice(0, 1)
            }
            setStepArray(workFlowArr)
        }
    }

    const onLoanTypeValue = (value) => {

        setStep(companyBranchList?.length !== 0 ? 4 : 3)
        setLoanTypeValue(value)
        setInstruction(getStingOnLanguage('HOME_INSURENCE_INSTRUCTION'))
    }

    const onHIValue = (value) => {

        setStep(stepArray.length === 8 ? 5 : stepArray.length === 5 ? 3 : 4)
        // setStep(stepArray.length === 7 ? 5 : 4)
        setHomeInsurenceValue(value)
        setInstruction(getStingOnLanguage('HOA_BUYER_INSTRUCTION'))
    }

    const getHOADetails = (value) => {
        if (value.hoaValue === '1' || (value.hoaValue !== '' && value.hoaAmount !== '' && value.hoaSellerPaid !== '')) {
            setStep(stepArray.length === 8 ? 6 : stepArray.length === 5 ? 4 : 5)
            //setStep(stepArray.length === 8 ? 6 : 5)
            setHOAValue(value)
            setInstruction(getStingOnLanguage('PROPERTY_TAX_BUYER_INSTRUCTION'))
        } else {
            setHOAValue()
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
    }

    const onLenderFeesValue = (value) => {
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
                                                            <SalesPriceWithTransaction defaultValue={defaultSalesPrice} labelText={salesPriceDescription} dateDefaultValue={defaultClosingDate} dateLabelText={ClosingDateDescription}
                                                                instruction={instruction} titleInsurance={titleInsurance} onSalesPriceValue={onSalesPriceValue} onCollapseClick={onCollapseClick} purchaseType={purchaseType} />
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
                                                                                                <HOAComponent hoa={HOA} instruction={instruction} getHOADetails={getHOADetails} onCollapseClick={onCollapseClick} />
                                                                                                {
                                                                                                    hoaValue && propertyTax && (
                                                                                                        <>
                                                                                                            <PropertyTax propertyTax={propertyTax} instruction={instruction} getPropertyTax={getPropertyTax} onCollapseClick={onCollapseClick} setEnableButton={setEnableButton} />
                                                                                                            {

                                                                                                                propertyTaxValue && (
                                                                                                                    <>
                                                                                                                        {
                                                                                                                            salePriceValue.transactionType !== constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID &&
                                                                                                                            <LenderFees instruction={instruction} lenderCost={lenderCost} onLenderFeesValue={onLenderFeesValue} onCollapseClick={onCollapseClick}
                                                                                                                                setEnableButton={setEnableButton} />
                                                                                                                        }

                                                                                                                        {
                                                                                                                            (salePriceValue.transactionType === constantValues.BUYER_SALES_PRICE_PURCHASE_TYPE_CASH_ID || lenderFeesValue) && <OtherExpenses otherExpenses={otherExpenses} instruction={instruction} />
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
                    isButtonEnable && (<button style={setSubmitButtonStyle()}>Calculate</button>)
                }
                {
                    <ConfirmationModalPortal modalContent={getStingOnLanguage('EDIT_FIELD')}
                        modalshow={modalShowPortal.value} onYesCallback={onYesCallback} onNoCallback={onNoCallback} />
                }
            </div>
        </section>
    )
}

export default BuyerNetSheet