import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import CustomeRadioButton from '../atomiccomponent/CustomeRadioButton'
import { constantValues } from '../utils/constants'
import { getCurrencyValidationRegexPattern, getStingOnAPILanguage, getStingOnLanguage, isNextButton } from '../utils/utility'
import CollapseDetails from './CollpaseDetails'

const Commission = ({ commission, getCommissionValue, instruction, onCollapseClick }) => {
    const [listingBuyerAgentCommissionList, setListingBuyerAgentCommissionList] = useState({
        listingAgent: [],
        buyerAgent: []
    })
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
                return 'images/3_commission.png'
            case constantValues.BUYER_CUSTOM_COMMISSION_RATE_ID:
                return 'images/custom_percentage.png'
            case constantValues.BUYER_CUSTOM_AMOUNT_COMMISSION_ID:
                return 'images/custom_dollar.png'
        }
    }

    const mapListingAgentWithImages = (id) => {
        switch ((id)) {
            case constantValues.LISTING_THREE_PERCENTAGE_COMMISSION_ID:
                return 'images/3_commission.png'
            case constantValues.LISTING_CUSTOM_COMMISSION_RATE_ID:
                return 'images/custom_percentage.png'
            case constantValues.LISTING_CUSTOM_AMOUNT_COMMISSION_ID:
                return 'images/custom_dollar.png'
        }
    }


    useEffect(() => {
        commission?.commissionOptionsList?.map(commission => {
            listingBuyerAgentCommissionList?.listingAgent.push({
                ...commission,
                isInput: commission.commissionOptionId === constantValues.LISTING_THREE_PERCENTAGE_COMMISSION_ID ? false : true,
                isType: commission.commissionOptionId === constantValues.LISTING_CUSTOM_COMMISSION_RATE_ID ? 'percentage' : 'currency',
                desc: getStingOnAPILanguage(commission, 'commissionDescription'),
                defaultValue: commission.listingAgentCommissionDefaultValue.toString(),
                type: commission.type,
                value: commission.commissionOptionId,
                image: mapBuyerAgentWithImages(commission.commissionOptionId)
            })
            listingBuyerAgentCommissionList?.buyerAgent.push({
                ...commission,
                isInput: commission.commissionOptionId === constantValues.BUYER_THREE_PERCENTAGE_COMMISSION_ID ? false : true,
                isType: commission.commissionOptionId === constantValues.BUYER_CUSTOM_COMMISSION_RATE_ID ? 'percentage' : 'currency',
                desc: getStingOnAPILanguage(commission, 'commissionDescription'),
                defaultValue: commission.buyerAgentCommissionDefaultValue.toString(),
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
        if (buyervalue.radioValue === constantValues.BUYER_THREE_PERCENTAGE_COMMISSION_ID && value.listingId === constantValues.LISTING_THREE_PERCENTAGE_COMMISSION_ID) {
            onNextButtonClick({
                ...value,
                buyerId: buyervalue.radioValue,
                buyerAmount: amount
            })
        }
    }

    const showNextButton = () => {
        const pattern = getCurrencyValidationRegexPattern()
        return value.listingId !== '' && value.lisitingAmount?.toString().match(pattern) !== null && value.buyerId !== '' && value.buyerAmount?.toString().match(pattern) !== null
    }

    const onNextButtonClick = (getvalue) => {
        setExpand(false)
        setCommissionInstruction()
        getCommissionValue(getvalue || value)
    }

    const getHtmlContent = () => {
        return (
            <>
                <span>{getStingOnLanguage('LISTING_AGENT_COMMISSION_SPAN')} {`${value.listingId === constantValues.LISTING_CUSTOM_AMOUNT_COMMISSION_ID ? `$${value.lisitingAmount}` : `${value.lisitingAmount}%`}`} </span>
                <span>{getStingOnLanguage('BUYER_AGENT_COMMISSION_SPAN')} {`${value.buyerId === constantValues.BUYER_CUSTOM_AMOUNT_COMMISSION_ID ? `$${value.buyerAmount}` : `${value.buyerAmount}%`}`} </span>
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
                            {<CustomeRadioButton radioOptionList={listingBuyerAgentCommissionList?.listingAgent}
                                description={getStingOnAPILanguage(commission, 'buyerAgentCommisionDescription')} id="commission-listing-agent" getCustomRadioButtonValue={getCustomRadioButtonListingValue} />}
                            {<div style={{ marginTop: '40px' }}>
                                <CustomeRadioButton radioOptionList={listingBuyerAgentCommissionList?.buyerAgent}
                                    description={getStingOnAPILanguage(commission, 'sellerAgentCommisionDescription')} id="commission-buyer-agent" getCustomRadioButtonValue={getCustomRadioButtonBuyerValue} />
                            </div>}
                        </div>
                        {
                            showNextButton() && (
                                <div className="row sales-next-btn">
                                    <div className="col-12">
                                        <p>{getStingOnLanguage('COMMISSION_TEXT')} {isNextButton(onNextButtonClick)}</p>
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

export default Commission