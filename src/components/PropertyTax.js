import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CustomeRadioButton from '../atomiccomponent/CustomeRadioButton'
import '../sass/propertytax.scss'
import { constantValues } from '../utils/constants'
import { isNextButton } from '../utils/utility'
import CollapseDetails from './CollpaseDetails'

const PropertyTax = ({ propertyTax, instruction, getPropertyTax, onCollapseClick, setEnableButton }) => {
    const [propertyTaxList, setPropertyTaxList] = useState({
        plistOptions: []
    })
    const propertyTaxListImages = ['/images/DefaultForState.png', '/images/BuyerPays.png']
    const [isExpand, setExpand] = useState(true)
    const [ptaxInstruction, setPTaxInstruction] = useState(instruction)
    const [value, setValue] = useState({
        ptaxId: '',
        ptaxAmount: ''
    })
    useEffect(() => {
        propertyTax?.propertyTaxOptionsList?.map(ptax => {
            propertyTaxList?.plistOptions.push({
                ...ptax,
                isInput: true,
                isType: ptax.propertyTaxOptionId === constantValues.PROPERTY_TAX_RATE_ID ? 'percentage' : 'currency',
                desc: ptax.propertyTaxOptionDescription,
                defaultValue: ptax.propertyTaxOptionDefaultValue || '',
                value: ptax.propertyTaxOptionId,
                image: ptax.propertyTaxOptionId === constantValues.PROPERTY_TAX_RATE_ID ? '/images/DefaultForState.png' : '/images/BuyerPays.png'
            })
        })

        setPropertyTaxList({
            plistOptions: propertyTaxList?.plistOptions
        })
    }, [])

    const getCustomRadioButtonPtaxListingValue = (ptaxvalue) => {
        let amount = ''
        switch (ptaxvalue.radioValue) {
            case constantValues.PROPERTY_TAX_RATE_ID:
                amount = ptaxvalue.amount[0]
                break;
            case constantValues.PROPERTY_TAX_AMOUNT_ID:
                amount = ptaxvalue.amount[1]
                break;
            default:
                break;
        }
        setValue({
            ...value,
            ptaxId: ptaxvalue.radioValue,
            ptaxAmount: amount
        })
    }
    const showNextButton = () => {
        const pattern = /(^[0-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        return !['0', ''].includes(value?.ptaxAmount?.value) && value?.ptaxAmount?.value?.match(pattern) !== null && value?.ptaxId !== ''
    }

    const onNextButtonClick = () => {
        setExpand(false)
        setPTaxInstruction()
        getPropertyTax(value)
        setEnableButton && setEnableButton(true, 'PropertyTax')
    }

    const getHtmlContent = () => {
        return (
            <>
                {
                    value.ptaxId === constantValues.PROPERTY_TAX_RATE_ID && <span>{constantValues.PROPERTY_TAX_SPAN} {value.ptaxAmount.value}%</span>
                }
                {
                    value.ptaxId === constantValues.PROPERTY_TAX_AMOUNT_ID && <span>{constantValues.PROPERTY_TAX_SPAN} ${value.ptaxAmount.value}</span>
                }
            </>

        )
    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setValue({
                ptaxId: '',
                ptaxAmount: ''
            })
            setPTaxInstruction(ins)
        }, 'PTax')
    }
    return (
        <Card instruction={ptaxInstruction}>
            {
                isExpand && (<>
                    <div className='property-tax-contaner'>
                        <CustomeRadioButton radioOptionList={propertyTaxList?.plistOptions} isInputHide={true}
                            description={propertyTax?.propertyTaxLabel} id="ptax-list" getCustomRadioButtonValue={getCustomRadioButtonPtaxListingValue} />
                        <p>{propertyTax.PropertyTaxDiscalimer}</p>
                    </div>
                    {
                        showNextButton() && (
                            <div className="row sales-next-btn">
                                <div className="col-12">
                                    <p>{constantValues.PROPERTY_TAX_TEXT} {isNextButton(onNextButtonClick)}</p>
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

export default PropertyTax