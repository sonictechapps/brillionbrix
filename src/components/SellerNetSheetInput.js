import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Stepper from "../atomiccomponent/Stepper"
import { PostData } from '../http/AsyncService'
import { loadingData, onInputFailure, onInputSuccess } from '../redux/actioncreator/SellerNetSheetInputaction'
import { constantValues } from '../utils/constants'
import { getColor, setColor, setSubmitButtonStyle } from '../utils/utility'
import '../sass/sellernetsheet.scss'
import LocationInput from './LocationInput'
import SalesPrice from './SalesPrice'
import Mortgage from './Mortgage'
import Commission from './Commission'
import HOAComponent from './HOAComponent'
import PropertyTax from './PropertyTax'
import ConfirmationModalPortal from './ConfirmationModalPortal'
import BranchComponent from './BranchComponent'
import OtherExpenses from './OtherExpenses'

const SellerNetSheetInput = () => {
    const [step, setStep] = useState(0)
    const [dropDownBranchOptions, setDropDownBranchOptions] = useState([])
    const [instruction, setInstruction] = useState(constantValues.SELLER_VIRTUAL_ASSISTANT)
    const [branch, setBranch] = useState()
    const [commissionValue, setCommissionValue] = useState()
    const [mortgageValue, setMortgageValue] = useState()
    const [hoaValue, setHOAValue] = useState()
    const [propertyTaxValue, setPropertyTaxValue] = useState()
    const { companyBranchList, companyID, compRep, companyName, companyBGColor, defaultSalesPrice, salesPriceDescription,
        ClosingDateDescription, defaultClosingDate, titleInsurance, mortgage, commission, HOA, propertyTax, otherExpenses } = useSelector(state => state?.sellerinput?.input) || {}
    const dispatch = useDispatch()
    const [selectedField, setSelectedField] = useState('')
    const [modalShowPortal, setModalShowPortal] = useState({
        value: false,
        function: {}
    })
    let [isButtonEnable, setButtonEnable] = useState(false)
    const [location, setLocation] = useState()
    const [salePriceValue, setSalesPriceValue] = useState()
    const [stepArray, setStepArray] = useState(['images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png', 'images/AmountWorkflowStep.png',
        'images/BranchWorkflowStep.png', 'images/AddressWorkflowStep.png', 'images/TransactionTypeWorkflowStep.png'])
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
            data: getColor()
        })
    }, [companyID])

    const getCommissionValue = (value) => {
        if (!['', '0'].includes(value.buyerAmount) && value.buyerId && !['', '0'].includes(value.lisitingAmount) && value.listingId) {
            setStep(stepArray.length === 7 ? 5 : 4)
            setCommissionValue({
                ...commissionValue,
                value
            })
            setInstruction(constantValues.HOA_INSTRUCTION)
        } else {
            setCommissionValue()
        }

    }

    useEffect(() => {
        const params = new URLSearchParams()
        params.append('companyID', '111')
        dispatch(PostData(constantValues.BASE_URL + constantValues.SELLER_NET_SHEET_INPUT_DETAILS, 'get', params, onInputSuccess,
            onInputFailure, loadingData))
    }, [])

    const onBranchChange = (index) => {
        setInstruction(constantValues.SELLER_LOCATION_INSTRUCTION)
        setStep(1)
        if (branch !== dropDownBranchOptions[index].value) {
            setBranch({
                details: dropDownBranchOptions[index],
                index: index
            })
        }

    }

    const getLocation = (location) => {
        setStep(stepArray.length === 7 ? 2 : 1)
        setInstruction(constantValues.TRANSACTION_TYPE_INSTRUCTION)
        setLocation({
            ...location
        })
    }

    const onSalesPriceValue = (value) => {
        if (value.currency && value.insuPaid) {
            setStep(stepArray.length === 7 ? 3 : 2)
            setSalesPriceValue(value)
            setInstruction(constantValues.MORTGAGE_INSTRUCTION)
        }
    }

    const onMortgageValue = (value) => {
        if (value && (value.inpvalue.length > 0 && !value.inpvalue.includes('') && !value.inpvalue.includes('0') && value.mort !== '') ||
            (value.inpvalue.length === 0 && value.mort !== '')) {
            setStep(stepArray.length === 7 ? 4 : 3)
            setMortgageValue(value)
            setInstruction(constantValues.COMMISSION_INSTRUCTION)
        } else {
            setMortgageValue()
        }
    }

    const getHOADetails = (value) => {
        if (value.hoaValue === '1' || (value.hoaValue !== '' && value.hoaAmount !== '' && value.hoaSellerPaid !== '')) {
            setStep(stepArray.length === 7 ? 6 : 5)
            setHOAValue(value)
            setInstruction(constantValues.PROPERTY_TAX_INSTRUCTION)
        } else {
            setHOAValue()
        }
    }

    const getPropertyTax = (value) => {
        if (value && value.radioValue !== '' && !['0', ''].includes(value.amount)) {
            setStep(stepArray.length === 7 ? 7 : 6)
            setPropertyTaxValue(value)
            setInstruction(constantValues.OTHER_INFO_INSTRUCTION)
        } else {
            setPropertyTaxValue()
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
                setInstruction(constantValues.SELLER_VIRTUAL_ASSISTANT)
                modalShowPortal.function(true, constantValues.SELLER_VIRTUAL_ASSISTANT)
                break
            case 'Location':
                setLocation()
                setSalesPriceValue()
                setMortgageValue()
                setCommissionValue()
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 1 : 0)
                setInstruction(constantValues.SELLER_LOCATION_INSTRUCTION)
                modalShowPortal.function(true, constantValues.SELLER_LOCATION_INSTRUCTION)
                break
            case 'Sales Price':
                setSalesPriceValue()
                setMortgageValue()
                setCommissionValue()
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 2 : 1)
                setInstruction(constantValues.TRANSACTION_TYPE_INSTRUCTION)
                modalShowPortal.function(true, constantValues.TRANSACTION_TYPE_INSTRUCTION)
                break
            case 'Mortgage':
                setMortgageValue()
                setCommissionValue()
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 3 : 2)
                setInstruction(constantValues.MORTGAGE_INSTRUCTION)
                modalShowPortal.function(true, constantValues.MORTGAGE_INSTRUCTION)
                break
            case 'Commission':
                setCommissionValue()
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 4 : 3)
                setInstruction(constantValues.COMMISSION_INSTRUCTION)
                modalShowPortal.function(true, constantValues.COMMISSION_INSTRUCTION)
                break
            case 'HOA':
                setHOAValue()
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 5 : 4)
                setInstruction(constantValues.HOA_INSTRUCTION)
                modalShowPortal.function(true, constantValues.HOA_INSTRUCTION)
                break
            case 'PTax':
                setPropertyTaxValue()
                setStep(stepArray.length === 7 ? 6 : 5)
                setInstruction(constantValues.PROPERTY_TAX_INSTRUCTION)
                modalShowPortal.function(true, constantValues.PROPERTY_TAX_INSTRUCTION)
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
                                                            <SalesPrice defaultValue={defaultSalesPrice} labelText={salesPriceDescription} dateDefaultValue={defaultClosingDate} dateLabelText={ClosingDateDescription}
                                                                instruction={instruction} titleInsurance={titleInsurance} onSalesPriceValue={onSalesPriceValue} onCollapseClick={onCollapseClick} />
                                                            {
                                                                salePriceValue && (
                                                                    <>
                                                                        <Mortgage mortgage={mortgage} onMortgageValue={onMortgageValue} instruction={instruction} onCollapseClick={onCollapseClick} />
                                                                        {
                                                                            mortgageValue && (
                                                                                <>
                                                                                    <Commission commission={commission} getCommissionValue={getCommissionValue} instruction={instruction} onCollapseClick={onCollapseClick} />
                                                                                    {
                                                                                        commissionValue && (
                                                                                            <>
                                                                                                <HOAComponent hoa={HOA} instruction={instruction} getHOADetails={getHOADetails} onCollapseClick={onCollapseClick} />
                                                                                                {
                                                                                                    hoaValue && propertyTax && (
                                                                                                        <>
                                                                                                            <PropertyTax propertyTax={propertyTax} instruction={instruction} getPropertyTax={getPropertyTax} onCollapseClick={onCollapseClick} setEnableButton={setEnableButton} />
                                                                                                            {
                                                                                                                propertyTaxValue && otherExpenses && <OtherExpenses otherExpenses={otherExpenses} instruction={instruction} />
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

                {/*
                {
                    location?.latlng && (<>
                        

                        {salePriceValue && (
                            <>
                                <Mortgage mortgage={mortgage} onMortgageValue={onMortgageValue} instruction={instruction} />
                                {
                                    mortgageValue && commission && (
                                        <>
                                            <Commission commission={commission} getCommissionValue={getCommissionValue} instruction={instruction} />
                                            {
                                                commissionValue && HOA && (
                                                    <>
                                                        <HOAComponent hoa={HOA} instruction={instruction} getHOADetails={getHOADetails} />
                                                        {
                                                            hoaValue && propertyTax && <PropertyTax propertyTax={propertyTax} instruction={instruction} getPropertyTax={getPropertyTax} />
                                                        }
                                                    </>
                                                )
                                            }
                                        </>)

                                }
                            </>)
                        }
                    </>)

                } */}
                {
                    isButtonEnable && (<button style={setSubmitButtonStyle()}>Calculate</button>)
                }

                {
                    <ConfirmationModalPortal modalContent={constantValues.EDIT_FIELD}
                        modalshow={modalShowPortal.value} onYesCallback={onYesCallback} onNoCallback={onNoCallback} />
                }


            </div>
        </section>
    )
}

export default React.memo(SellerNetSheetInput)