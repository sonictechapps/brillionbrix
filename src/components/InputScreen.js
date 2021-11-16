import React, { useEffect, useState } from "react"
import AutoCompleteTextView from "../atomiccomponent/AutoCompleteTextView"
import CurrencyEditText from "../atomiccomponent/CurrencyEditText"
import Dropdown from '../atomiccomponent/Dropdown'
import { useSelector, useDispatch } from "react-redux"
import '../sass/inputscreen.scss'
import { PostData } from "../http/AsyncService"
import { constantValues } from "../utils/constants"
import { loadingData, onInputFailure, onInputSuccess } from "../redux/actioncreator/InputAction"
import RadioButton from "../atomiccomponent/RadioButton"
import Card from "../atomiccomponent/Card"
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import Accordion from "../atomiccomponent/Accordion"

const InputScreen = () => {
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: 'AIzaSyDao5jHYWwwCyJPmIf_qFlWVvSvUePHM_4',
    });
    const dispatch = useDispatch()

    const { companyBrnachList, transactionTypesList, companyID, titleInsurance } = useSelector(state => state?.input?.input)
    console.log('check--->', companyBrnachList, ' ', transactionTypesList, ' ', companyID)

    const [dropDownBranchOptions, setDropDownBranchOptions] = useState([])
    const [dropDownTransactionOptions, setDropDownTransactionOptions] = useState([])
    const [autocompleteOptions, setAutocompleteOptions] = useState([])
    const [insurencePaidOptions, setInsurencePaidOptions] = useState([])
    const [transactionValue, setTransactionValue] = useState({})
    const [refiOptions, setRefiOptions] = useState([])
    const refinanceArray = [
        {
            name: 'Yes',
            value: 'yes'
        },
        {
            name: 'No',
            value: 'no'
        }
    ]
    useEffect(() => {
        console.log('ggg', companyBrnachList, ' ', transactionTypesList)
        if (companyBrnachList?.length > 0) {
            console.log('d')
            const dropDownarr = []
            companyBrnachList.forEach(branch => {
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
            })
            setDropDownTransactionOptions(dropDownarr)
            setTransactionValue(transactionTypesList[0])
        }
        if (titleInsurance?.titleInsuranceOptionsList?.length > 0){
            const dropDownarr = []
            titleInsurance?.titleInsuranceOptionsList.forEach(insu => {
                let obj = {
                    ...insu,
                    name: insu.titleInsuranceOptionDescription,
                    value: insu.titleInsuranceOptionId
                }
                dropDownarr.push(obj)
            })
            setInsurencePaidOptions(dropDownarr)
        }
    }, [companyID])

    useEffect(() => {
        // fetch place details for the first element in placePredictions array
        if (placePredictions.length) {
            setAutocompleteOptions([])
            const tempAutoomplete = []
            console.log('test-->', placePredictions)
            placePredictions.forEach(place => {
                const placeObj = {
                    name: place.description,
                    value: place.place_id
                }
                tempAutoomplete.push(placeObj)
            })

            setAutocompleteOptions(tempAutoomplete)
        }

    }, [placePredictions])

    const onItemSelectedCallback = (index) => {

    }

    const onRefinanceArraCallback = (index) => {

    }

    const onTransactionValueChanged = (index, value) => {
        setTransactionValue(transactionTypesList[index])
    }

    useEffect(() => {
        if (transactionValue.hasOwnProperty('refiOptions')) {
            const arr = []
            transactionValue.refiOptions.forEach(refi => {
                const refiObj = {
                    name: refi,
                    value: refi
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
    return (
        <form autocomplete="off" action="#">
            {console.log('autocompleteOptions', autocompleteOptions)}
            <Card>
                <div className="row">

                    <div className="col-12 col-md-8 mr-5 location-text">
                        <div className="label-holder"><label>Property Location</label></div>
                        <AutoCompleteTextView listItems={autocompleteOptions} style={{ width: '100%' }} placeHolder="Start Typing, then pick from suggestions" name="abc" getPlacePredictions={getPlacePredictions} />
                    </div>
                    <div className="col-12 col-md-4 condo-text">
                        <div className="label-holder"><label>Condo Nr.</label></div>
                        <CurrencyEditText placeholder="if applicable" type="text" />
                    </div>

                </div>
            </Card>
            <Card>
                <div className="row">
                    <div className="col-12 branch-text">
                        <div className="label-holder"><label>Choose a Branch</label></div>
                        <Dropdown options={dropDownBranchOptions} onItemSelectedCallback={onItemSelectedCallback} id='branch-dropdown' />
                    </div>
                </div>
            </Card>
            <Card>
                <div className="row">
                    <div className="col-12 transcation-type-text">

                        <RadioButton options={dropDownTransactionOptions} dafaultValue={transactionValue && transactionValue.transactionTypeId} onRadioChanged={onTransactionValueChanged} />
                        {/* <Dropdown options={dropDownTransactionOptions} onItemSelectedCallback={onItemSelectedCallback} id='transaction-dropdown' /> */}
                    </div>
                </div>
            </Card>
            {
                transactionValue?.defaultSalesPrice && (
                    <Card>
                        <div className="row">
                            <div className="col-12 sales-price-text">
                                <div className="label-holder"><label>{transactionValue.salesPriceDescription}</label></div>
                                <CurrencyEditText placeholder="Enter property sales price" type="text" defaultValue={transactionValue.defaultSalesPrice} />
                            </div>
                        </div>
                    </Card>
                )
            }
            {
                transactionValue?.defaultLoanAmount && (
                    <Card>
                        <div className="row">
                            <div className="col-12 loan-amount-text">
                                <div className="label-holder"><label>{transactionValue.loanPriceDescription}</label></div>
                                <CurrencyEditText placeholder="Enter amount of new loan" type="text" defaultValue={transactionValue.defaultLoanAmount} />
                            </div>
                        </div>
                    </Card>
                )
            }
            {
                titleInsurance && (
                    <Card>
                        <div className="row">
                            <div className="col-12 insu-paid-by-text">
                                <div className="label-holder"><label>{titleInsurance.titleInsuranceLabel}</label></div>
                                <Dropdown options={insurencePaidOptions} onItemSelectedCallback={onItemSelectedCallback} id='insu-paid-by-dropdown' />
                            </div>
                        </div>
                    </Card>
                )
            }

            {
                (transactionValue?.transactionTypeId == '30' || transactionValue?.transactionTypeId == '40') && (
                    <div className='accordion-sec'>
                        <Accordion header={'Additional Details'}>
                            <div style={{ backgroundColor: 'cadetblue', borderRadius: '5px' }}>
                                <Card styles={{ marginTop: '0px !important' }}>
                                    <div className="row">
                                        <div className="col-12 refinance-text">
                                            <div className="label-holder"><label>Is this refinance a 50(a)(6) cash out</label></div>
                                            <Dropdown options={refiOptions} onItemSelectedCallback={onRefinanceArraCallback} id='refinance-dropdown' />
                                        </div>
                                    </div>
                                </Card>
                                <Card styles={{ marginTop: '0px !important' }}>
                                    <div className="row">
                                        <div className="col-12 refinance-text">
                                            <div className="label-holder"><label>How old is the prior policy?</label></div>
                                            {/* <Dropdown options={refinanceArray} onItemSelectedCallback={onRefinanceArraCallback} id='refinance-dropdown' /> */}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Accordion>
                    </div>
                )
            }


        </form>
    )

}

export default InputScreen