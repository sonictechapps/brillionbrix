import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CustomeRadioButton from '../atomiccomponent/CustomeRadioButton'
import '../sass/propertytax.scss'
import CollapseDetails from './CollpaseDetails'

const PropertyTax = ({ propertyTax, instruction, getPropertyTax, onCollapseClick }) => {
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
                isType: ptax.propertyTaxOptionId === '1' ? 'percentage' : 'currency',
                desc: ptax.propertyTaxOptionDescription,
                defaultValue: ptax.propertyTaxOptionDefaultValue || '',
                value: ptax.propertyTaxOptionId
            })
        })

        setPropertyTaxList({
            plistOptions: propertyTaxList?.plistOptions
        })
    }, [])

    const getCustomRadioButtonPtaxListingValue = (ptaxvalue) => {
        let amount = ''
        switch (ptaxvalue.radioValue) {
            case '1':
                amount = ptaxvalue.amount[0]
                break;
            case '2':
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
        return !['0',''].includes(value.ptaxAmount) && value.ptaxId !==''
    }

    const onNextButtonClick = () => {
        setExpand(false)
        setPTaxInstruction()
        getPropertyTax(value)
    }

    const getHtmlContent = () => {
        return (
            <>
            {
                value.ptaxId === '1' &&  <span>PropertyTax: {value.ptaxAmount}%</span>
            }
            {
                value.ptaxId === '2' &&  <span>PropertyTax: ${value.ptaxAmount}</span>
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
                        <CustomeRadioButton radioOptionList={propertyTaxList?.plistOptions} imageList={propertyTaxListImages}
                            description={propertyTax?.propertyTaxLabel} id="ptax-list" getCustomRadioButtonValue={getCustomRadioButtonPtaxListingValue} />
                        <p>{propertyTax.PropertyTaxDiscalimer}</p>
                    </div>
                    {
                        showNextButton() && (
                            <div className="row sales-next-btn">
                                <div className="col-12">
                                    <p>If you're done entering your sales price and closing date, <span onClick={onNextButtonClick}>Click here</span></p>
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