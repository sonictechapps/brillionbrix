import React, { useEffect, useRef, useState } from "react"
import CurrencyEditText from "../atomiccomponent/CurrencyEditText"
import Dropdown from '../atomiccomponent/Dropdown'
import { useSelector, useDispatch } from "react-redux"
import '../sass/inputscreen.scss'
import { PostData } from "../http/AsyncService"
import { constantValues } from "../utils/constants"
import { loadingData, onInputFailure, onInputSuccess } from "../redux/actioncreator/InputAction"
import RadioButton from "../atomiccomponent/RadioButton"
import Card from "../atomiccomponent/Card"
import LocationInput from "./LocationInput"
import CollapseDetails from "./CollpaseDetails"
import Stepper from "../atomiccomponent/Stepper"
import ConfirmationModalPortal from "./ConfirmationModalPortal"
import { setColor, setSubmitButtonStyle } from '../utils/utility'
const InputScreen = () => {

    const dispatch = useDispatch()

    const { companyBranchList, transactionTypesList, companyID, compRep, companyName, companyBGColor } = useSelector(state => state?.input?.input)
    const [dropDownBranchOptions, setDropDownBranchOptions] = useState([])
    const [dropDownTransactionOptions, setDropDownTransactionOptions] = useState([])
    const [insurencePaidOptions, setInsurencePaidOptions] = useState([])
    const [transactionValue, setTransactionValue] = useState()
    const [refiOptions, setRefiOptions] = useState([])
    const [refiOption, setRefiOption] = useState()
    const [branch, setBranch] = useState()
    const [insurencePaid, setInsurenePaid] = useState()
    const [salesPrice, setSalesPrice] = useState('')
    const [loanPrice, setLoanPrice] = useState('')
    const [mortPrice, setMortPrice] = useState('')
    const transactionTypeImages = ['/images/test1.png', '/images/test1.png', '/images/test1.png', '/images/test1.png']
    const refiOptionsImages = ['/images/test1.png', '/images/test1.png', '/images/test1.png']
    const titleInsurencePaidImages = ['/images/test1.png', '/images/test1.png', '/images/test1.png', '/images/test1.png']

    const refiOptionsRef = useRef(null)
    const refiOptionsCollpaseRef = useRef(null)
    const [instruction, setInstruction] = useState(constantValues.VIRTUAL_ASSISTANT)
    const [isBranchExpand, setBranchExpand] = useState(true)
    const [isLocationExpand, setLocationExpand] = useState(true)
    const [isTransactionTypeExpand, setTransactionTypeExpand] = useState(true)
    const [modalShowPortal, setModalShowPortal] = useState(false)

    const [location, setLocation] = useState()
    const [step, setStep] = useState(0)
    const [selectedField, setSelectedField] = useState('')
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

        if (transactionTypesList?.length > 0) {
            const dropDownarr = []
            transactionTypesList.forEach(transaction => {
                let tcObj = {
                    ...transaction,
                    name: transaction.transactionTypeDescription,
                    value: transaction.transactionTypeId
                }
                dropDownarr.push(tcObj)
                if (transaction?.titleInsurance?.titleInsuranceOptionsList?.length > 0) {
                    const titledropDownarr = []
                    transaction?.titleInsurance?.titleInsuranceOptionsList.forEach(insu => {
                        let obj = {
                            ...insu,
                            name: insu.titleInsuranceOptionDescription,
                            value: insu.titleInsuranceOptionId
                        }
                        titledropDownarr.push(obj)
                    })
                    setInsurencePaidOptions(titledropDownarr)
                }
            })
            setDropDownTransactionOptions(dropDownarr)
        }
        companyBGColor && setColor(companyBGColor)

    }, [companyID])

    const getLocation = (location1, desc) => {
        setLocationExpand(false)
        setTransactionTypeExpand(true)
        setStep(2)
        setInstruction(constantValues.TRANSACTION_TYPE_INSTRUCTION)
        setLocation({
            ...location,
            latlng: location1,
            desc: desc,

        })
    }

    const onBranchChange = (index) => {
        setInstruction(constantValues.LOCATION_INSTRUCTION)
        setStep(1)
        setBranchExpand(false)
        setLocationExpand(true)
        if (branch !== dropDownBranchOptions[index].value) {
            setBranch({
                details: dropDownBranchOptions[index],
                index: index
            })
        }

    }

    const onTransactionValueChanged = (index, value) => {
        setStep(3)
        setInstruction(constantValues.INSURENCE_PAID_INSTRUCTION)
        setTransactionValue(transactionTypesList[index])
        setTransactionTypeExpand(false)
        setInsurenePaid('')
        setRefiOption('')
    }

    const onRefOptionsChanged = (index, value) => {
        setRefiOption(refiOptions[index])
    }

    useEffect(() => {
        if (transactionValue?.hasOwnProperty('refiOption')) {
            const arr = []
            transactionValue.refiOption.forEach(refi => {
                const refiObj = {
                    name: refi.refinanceOptionsDesc,
                    value: refi.refinanceOptionId
                }
                arr.push(refiObj)
            })
            setRefiOptions(arr)
        } else {
            setRefiOptions([])
        }
    }, [transactionValue])

    useEffect(() => {
        const params = new URLSearchParams()
        params.append('companyID', '111')
        dispatch(PostData(constantValues.BASE_URL + constantValues.INPUT_DETAILS, 'get', params, onInputSuccess,
            onInputFailure, loadingData))
    }, [])

    const onCurrencyChange = (value, id) => {
        switch (id) {
            case 'sales-price':
                setSalesPrice(value || transactionValue?.defaultSalesPrice)
                break
            case 'loan-price':
                setLoanPrice(value || transactionValue?.defaultLoanAmount)
                break
            case 'mortgage-price':
                setMortPrice(value || transactionValue?.defaultRefiCashOutAmount)
                break
        }
    }

    const onDropDownCollapseClick = () => {
        setSelectedField('Branch-DropDown')
        setModalShowPortal(true)
    }

    const onLocationCollapseClick = () => {
        setSelectedField('Location')
        setModalShowPortal(true)

    }

    const onTransCollpaseClick = () => {
        setSelectedField('Transaction-Type')
        setModalShowPortal(true)
    }

    const onInsurencePaidChange = (index, value) => {
        setInsurenePaid(insurencePaidOptions[index])
    }

    const onRefiOptionsCollpaseClick = () => {
        refiOptionsRef.current.classList.remove('refinance-type')
        refiOptionsCollpaseRef.current.classList.remove('refinance-type-collapse-active')
    }

    const checkInputProperties = () => {
        const salesPriceDescription = transactionValue?.salesPriceDescription
        const loanPriceDescription = transactionValue?.loanPriceDescription
        const refiCashOutAmountDesc = transactionValue?.refiCashOutAmountDesc
        return ((salesPriceDescription && loanPriceDescription) || ((loanPriceDescription && refiCashOutAmountDesc)))
    }

    const getCondoNumber = value => {
        setLocation({
            ...location,
            condo: value
        })
    }

    const onYesCallback = () => {
        setModalShowPortal(false)
        switch (selectedField) {
            case 'Branch-DropDown':
                setBranchExpand(true)
                setBranch()
                setLocation()
                setTransactionValue()
                setStep(0)
                setInstruction(constantValues.VIRTUAL_ASSISTANT)
            case 'Location':
                setStep(1)
                setLocationExpand(true)
                setLocation()
                setTransactionValue()
                setInstruction(constantValues.LOCATION_INSTRUCTION)
            case 'Transaction-Type':
                setStep(2)
                setTransactionTypeExpand(true)
                setTransactionValue()
                setInstruction(constantValues.TRANSACTION_TYPE_INSTRUCTION)
        }

    }

    const onNoCallback = () => {
        setModalShowPortal(false)
    }

    const enableCalculateButton = () => {
        const pattern = /(^\$[1-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        switch (transactionValue?.transactionTypeId) {
            case '10':
                return salesPrice?.match(pattern) && loanPrice?.match(pattern)
            case '20':
                return salesPrice?.match(pattern)
            case '30':
                return loanPrice?.match(pattern)
            case '40':
                return loanPrice?.match(pattern) && mortPrice?.match(pattern)
        }
        return false
    }

    return (
        <>
            <Stepper step={step} />
            {
                isBranchExpand && (
                    <Card iconurl={compRep?.companyRepImageURL} instruction={instruction}>
                        <div className="row">
                            <div className="col-12" className='dropDownExpand-active'>
                                <Dropdown options={dropDownBranchOptions} onItemSelectedCallback={onBranchChange} id='branch-dropdown' selectedIndex={branch?.index}
                                    labelTitle={`${constantValues.BRANCH_DROPDOWN_LABEL1}${companyName}${constantValues.BRANCH_DROPDOWN_LABEL2}`} />
                            </div>
                        </div>
                    </Card>
                )
            }
            {
                !isBranchExpand && (
                    <Card>
                        <div className="row">
                            <div className="col-12" className='dropDownCollapse-active'>
                                <CollapseDetails content={`Branch: ${branch?.details?.name}`} onEditClick={onDropDownCollapseClick} />
                            </div>
                        </div>
                    </Card>
                )
            }
            {
                (branch && isLocationExpand) && (
                    <Card iconurl={compRep?.companyRepImageURL} instruction={instruction}>
                        <p className="question-style">{constantValues.LOCATION_LABEL}</p>
                        <LocationInput getLocation={getLocation} defaultlocation={location} getCondoNumber={getCondoNumber} />
                    </Card>
                )
            }

            {
                (branch && !isLocationExpand) && (
                    <Card>
                        <div className="row">
                            <div className="col-12" className='dropDownCollapse-active'>
                                <CollapseDetails content={`Location: ${location?.condo || ''} ${location?.desc}`} onEditClick={onLocationCollapseClick} />
                            </div>
                        </div>
                    </Card>
                )
            }
            {
                (location && isTransactionTypeExpand) && (
                    <Card iconurl={compRep?.companyRepImageURL} instruction={instruction}>
                        <div className="row">

                            <div className="col-12" className='transaction-type-active'>
                                <p className="question-style">{constantValues.TRANSACTION_TYPE_LABEL}</p>
                                <RadioButton options={dropDownTransactionOptions} onRadioChanged={onTransactionValueChanged} id='trans-type-id'
                                    dafaultValue={transactionValue?.transactionTypeId}
                                    images={transactionTypeImages} />
                            </div>
                        </div>
                    </Card>
                )
            }
            {
                (location && !isTransactionTypeExpand) && (
                    <Card>
                        <div className="row">
                            <div className="col-12" className='transaction-type-collapse-active'>
                                <CollapseDetails content={`Transaction Type: ${transactionValue?.transactionTypeDescription}`} onEditClick={onTransCollpaseClick} />
                            </div>
                        </div>
                    </Card>
                )
            }
            {
                transactionValue && (
                    <Card iconurl={compRep?.companyRepImageURL} instruction={instruction}>
                        {
                            transactionValue?.titleInsurance && (
                                <div className="row">
                                    <div className="col-12" className='title-insurence-active'>
                                        <p className="question-style">{transactionValue?.titleInsurance?.titleInsuranceLabel}</p>
                                        <RadioButton options={insurencePaidOptions} onRadioChanged={onInsurencePaidChange}
                                            dafaultValue={insurencePaid?.name} id={'insu-paid-id'}
                                            images={titleInsurencePaidImages} />
                                    </div>

                                </div>
                            )
                        }
                        {
                            refiOptions.length > 0 && (
                                <div className="row">
                                    <div className="col-12" className='refinance-type-active'>
                                        <p className="question-style">{constantValues.REFINANCE_LABEL}</p>
                                        <RadioButton options={refiOptions} onRadioChanged={onRefOptionsChanged} id={'ref-id'}
                                            images={refiOptionsImages} />
                                    </div>
                                </div>
                            )
                        }
                        <div className={`${checkInputProperties() ?
                            'amount-input-container-all' : 'amount-input-container'}`}>
                            {
                                (transactionValue && transactionValue?.defaultSalesPrice) && (

                                    <div>
                                        <CurrencyEditText placeholder="Enter property sales price" type="text"
                                            defaultValue={transactionValue.defaultSalesPrice} id={'sales-price'}
                                            onCurrencyChange={onCurrencyChange} labelText={transactionValue.salesPriceDescription} />
                                    </div>
                                )
                            }

                            {
                                (transactionValue?.defaultLoanAmount && transactionValue) && (
                                    <div>

                                        <CurrencyEditText placeholder="Enter amount of new loan" type="text"
                                            defaultValue={transactionValue.defaultLoanAmount} id={'loan-price'}
                                            labelText={transactionValue.loanPriceDescription} onCurrencyChange={onCurrencyChange} />

                                    </div>
                                )
                            }

                            {
                                transactionValue?.refiCashOutAmountDesc && (
                                    <div>
                                        <CurrencyEditText placeholder="Enter mortgage principal amount" type="text"
                                            defaultValue={transactionValue.defaultRefiCashOutAmount} id={'mortgage-price'}
                                            labelText={transactionValue.refiCashOutAmountDesc} onCurrencyChange={onCurrencyChange} />
                                    </div>
                                )
                            }
                        </div>
                    </Card>
                )
            }
            {
                (enableCalculateButton()) && (<button style={setSubmitButtonStyle()}>Calculate</button>)
            }
            {
                <ConfirmationModalPortal modalContent={'Do you want to edit the field?'}
                    modalshow={modalShowPortal} onYesCallback={onYesCallback} onNoCallback={onNoCallback} />
            }
        </>
    )

}

export default InputScreen