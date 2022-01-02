import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CustomeRadioButton from '../atomiccomponent/CustomeRadioButton'
import { constantValues } from '../utils/constants'
import { isNextButton } from '../utils/utility'
import CollapseDetails from './CollpaseDetails'

const Commission = ({ commission, getCommissionValue, instruction, onCollapseClick }) => {
    const [listingBuyerAgentCommissionList, setListingBuyerAgentCommissionList] = useState({
        listingAgent: [],
        buyerAgent: []
    })
    const listingAgentCommissionImages = ['/images/3_commission.png', '/images/custom_percentage.png', '/images/custom_dollar.png']
    const buyerAgentCommissionImages = ['/images/3_commission.png', '/images/custom_percentage.png', '/images/custom_dollar.png']
    const [value, setValue] = useState({
        listingId: '',
        lisitingAmount: '',
        buyerId: '',
        buyerAmount: ''
    })
    const [isExpand, setExpand] = useState(true)
    const [commissionInstruction, setCommissionInstruction] = useState(instruction)

    const mapBuyerAgentWithImages = (id) => {
        switch ((id)) {
            case constantValues.BUYER_THREE_PERCENTAGE_COMMISSION_ID:
                return '/images/3_commission.png'
            case constantValues.BUYER_CUSTOM_COMMISSION_RATE_ID:
                return '/images/custom_percentage.png'
            case constantValues.BUYER_CUSTOM_AMOUNT_COMMISSION_ID:
                return '/images/custom_dollar.png'
        }
    }

    const mapListingAgentWithImages = (id) => {
        switch ((id)) {
            case constantValues.LISTING_THREE_PERCENTAGE_COMMISSION_ID:
                return '/images/3_commission.png'
            case constantValues.LISTING_CUSTOM_COMMISSION_RATE_ID:
                return '/images/custom_percentage.png'
            case constantValues.LISTING_CUSTOM_AMOUNT_COMMISSION_ID:
                return '/images/custom_dollar.png'
        }
    }

    useEffect(() => {
        commission?.commissionOptionsList?.map(commission => {
            listingBuyerAgentCommissionList?.listingAgent.push({
                ...commission,
                isInput: commission.commissionOptionId === '1' ? false : true,
                isType: commission.commissionOptionId === '2' ? 'percentage' : 'currency',
                desc: commission.commissionDescription,
                defaultValue: commission.listingAgentCommissionDefaultValue || '',
                type: commission.type,
                value: commission.commissionOptionId,
                image: mapBuyerAgentWithImages(commission.commissionOptionId)
            })
            listingBuyerAgentCommissionList?.buyerAgent.push({
                ...commission,
                isInput: commission.commissionOptionId === '1' ? false : true,
                isType: commission.commissionOptionId === '2' ? 'percentage' : 'currency',
                desc: commission.commissionDescription,
                defaultValue: commission.buyerAgentCommissionDefaultValue || '',
                type: commission.type,
                value: commission.commissionOptionId,
                image: mapListingAgentWithImages(commission.commissionOptionId)
            })
        })
        setListingBuyerAgentCommissionList({
            listingAgent: listingBuyerAgentCommissionList?.listingAgent,
            buyerAgent: listingBuyerAgentCommissionList?.buyerAgent
        })
    }, [])

    const getCustomRadioButtonListingValue = (listingvalue) => {
        console.log('opp33', listingvalue)
        let amount = ''
        switch (listingvalue.radioValue) {
            case constantValues.LISTING_THREE_PERCENTAGE_COMMISSION_ID:
                amount = listingvalue.amount[0].value
                break;
            case constantValues.LISTING_CUSTOM_COMMISSION_RATE_ID:
                amount = listingvalue.amount[1].value
                break;
            case constantValues.LISTING_CUSTOM_AMOUNT_COMMISSION_ID:
                amount = listingvalue.amount[2].value
                break;
            default:
                break;
        }
        setValue({
            ...value,
            listingId: listingvalue.radioValue,
            lisitingAmount: amount,
        })
        console.log('getvalue-->', value, listingvalue)
        if (value.buyerId === constantValues.BUYER_THREE_PERCENTAGE_COMMISSION_ID && listingvalue.radioValue === constantValues.LISTING_THREE_PERCENTAGE_COMMISSION_ID) {
            onNextButtonClick({
                ...value,
                listingId: listingvalue.radioValue,
                lisitingAmount: amount,
            })
        }
    }

    const getCustomRadioButtonBuyerValue = (buyervalue) => {
        let amount = ''
        switch (buyervalue.radioValue) {
            case constantValues.BUYER_THREE_PERCENTAGE_COMMISSION_ID:
                amount = buyervalue.amount[0].value
                break;
            case constantValues.BUYER_CUSTOM_COMMISSION_RATE_ID:
                amount = buyervalue.amount[1].value
                break;
            case constantValues.BUYER_CUSTOM_AMOUNT_COMMISSION_ID:
                amount = buyervalue.amount[2].value
                break;
            default:
                break;
        }
        setValue({
            ...value,
            buyerId: buyervalue.radioValue,
            buyerAmount: amount
        })
        console.log('getvalue-->', value, buyervalue)
        if (buyervalue.radioValue === constantValues.BUYER_THREE_PERCENTAGE_COMMISSION_ID && value.listingId === constantValues.LISTING_THREE_PERCENTAGE_COMMISSION_ID) {
            onNextButtonClick({
                ...value,
                buyerId: buyervalue.radioValue,
                buyerAmount: amount
            })
        }
    }

    const showNextButton = () => {
        const pattern = /(^[1-9]([0-9]+\.?[0-9]*|\.?[0-9]+)?)$/gm
        console.log('next-->', value.lisitingAmount, value.buyerAmount)
        return value.listingId !== '' && value.lisitingAmount?.match(pattern) !== null && value.buyerId !== '' && value.buyerAmount?.match(pattern) !== null
    }

    const onNextButtonClick = (getvalue) => {
        let tempValue = getvalue || value
        console.log('tempValue', getvalue)
        setExpand(false)
        setCommissionInstruction()
        getCommissionValue(tempValue)
    }

    const getHtmlContent = () => {
        return (
            <>
                <span>Listing Agent commission: {`${value.listingId === constantValues.LISTING_CUSTOM_AMOUNT_COMMISSION_ID ? `$${value.lisitingAmount}` : `${value.lisitingAmount}%`}`} </span>
                <span>Buyer's agent commission: {`${value.buyerId === constantValues.BUYER_CUSTOM_AMOUNT_COMMISSION_ID ? `$${value.buyerAmount}` : `${value.buyerAmount}%`}`} </span>
            </>
        )
    }
    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setValue({
                listingId: '',
                lisitingAmount: '',
                buyerId: '',
                buyerAmount: ''
            })
            setCommissionInstruction(ins)
        }, 'Commission')
    }
    return (
        <Card instruction={commissionInstruction}>
            {
                isExpand && (
                    <>
                        <div style={{ marginTop: '30px' }}>
                            {<CustomeRadioButton radioOptionList={listingBuyerAgentCommissionList?.listingAgent} id='listing-comm'
                                description={commission.byuerAgentCommisionDescription} id="commission-listing-agent" getCustomRadioButtonValue={getCustomRadioButtonListingValue} />}
                            {<div style={{ marginTop: '40px' }}>
                                <CustomeRadioButton radioOptionList={listingBuyerAgentCommissionList?.buyerAgent} id='buyer-comm'
                                    description={commission.sellerAgentCommisionDescription} id="commission-buyer-agent" getCustomRadioButtonValue={getCustomRadioButtonBuyerValue} />
                            </div>}
                        </div>
                        {
                            showNextButton() && (
                                <div className="row sales-next-btn">
                                    <div className="col-12">
                                        <p>{constantValues.COMMISSION_TEXT} {isNextButton(onNextButtonClick)}</p>
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

export default Commission