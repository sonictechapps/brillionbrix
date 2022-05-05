import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CustomeRadioButton from '../atomiccomponent/CustomeRadioButton'
import '../sass/propertytax.scss'
import { constantValues } from '../utils/constants'
import { addCommaInNumber, getLanguage, getStingOnAPILanguage, getStingOnLanguage, isNextButton } from '../utils/utility'
import CollapseDetails from './CollpaseDetails'

const PropertyTax = ({ propertyTax, instruction, getPropertyTax, onCollapseClick, setEnableButton }) => {
    const [propertyTaxList, setPropertyTaxList] = useState({
        plistOptions: []
    })
    const propertyTaxListImages = ['images/DefaultForState.png', 'images/BuyerPays.png']
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
                desc: getLanguage().toLowerCase() === 'es' ? ptax.propertyTaxOptionDescription_es : ptax.propertyTaxOptionDescription,
                defaultValue: ptax.propertyTaxOptionDefaultValue.toString(),
                value: ptax.propertyTaxOptionId,
                image: ptax.propertyTaxOptionId === constantValues.PROPERTY_TAX_RATE_ID ? 'images/custom_percentage.png' : 'images/custom_dollar.png'
            })
            setValue({
                ...value,
                ptaxId: propertyTaxList?.plistOptions[0].value,
                ptaxAmount: propertyTaxList?.plistOptions[0].defaultValue
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
                    value.ptaxId === constantValues.PROPERTY_TAX_RATE_ID && <span>{getStingOnLanguage('PROPERTY_TAX_SPAN')} {value.ptaxAmount.value}%</span>
                }
                {
                    value.ptaxId === constantValues.PROPERTY_TAX_AMOUNT_ID && <span>{getStingOnLanguage('PROPERTY_TAX_SPAN')} ${addCommaInNumber(value.ptaxAmount.value)}</span>
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
                        <CustomeRadioButton radioOptionList={propertyTaxList?.plistOptions} isInputHide={false}
                            description={getStingOnAPILanguage(propertyTax, 'propertyTaxLabel')} id="ptax-list" getCustomRadioButtonValue={getCustomRadioButtonPtaxListingValue} 
                            defaultValue = {value.ptaxId}/>
                        <p>{propertyTax.PropertyTaxDiscalimer}</p>
                    </div>
                    {
                        showNextButton() && (
                            <div className="row sales-next-btn">
                                <div className="col-12">
                                    <p>{getStingOnLanguage('PROPERTY_TAX_TEXT')} {isNextButton(onNextButtonClick)}</p>
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
                        <div className="col-12 dropDownCollapse-active">
                            <CollapseDetails htmlContent={getHtmlContent()} onEditClick={onCollpase} showEdit={true} />
                        </div>
                    </div>
                )
            }

        </Card>
    )
}

export default PropertyTax