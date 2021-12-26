import React, { useState } from 'react'
import Card from '../atomiccomponent/Card'
import RadioButton from '../atomiccomponent/RadioButton'
import { constantValues } from '../utils/constants'
import CollapseDetails from './CollpaseDetails'

const TransactionType = ({ instruction, dropDownTransactionOptions, onTransactionValueChanged, onCollapseClick }) => {
    const [transactionTypeInstruction, setTransactionTypeInstruction] = useState(instruction)
    const [isExpand, setExpand] = useState(true)
    const [values, setValues] = useState({
        transaction: {}
    })

    const onTransactionChanged = (itemIndex, value) => {
        setValues({
            ...values,
            transaction: dropDownTransactionOptions[itemIndex],
        })
        onTransactionValueChanged({
            ...values,
            transaction: dropDownTransactionOptions[itemIndex],
        })
        setExpand(false)
        setTransactionTypeInstruction()
    }

    const getHtmlContent = () => {
        return (
            <span>Transaction Type: {values.transaction.transactionTypeDescription}</span>
        )
    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setValues({
            })
            setTransactionTypeInstruction(ins)
        }, 'Transaction Type')
    }
    const transactionTypeImages = ['/images/purchasewithfinance.png', '/images/cash_transfer.png', '/images/refinance.png', '/images/refinancecashout.png']
    return (
        <Card instruction={transactionTypeInstruction}>
            {
                isExpand && (
                    <div className="row">
                        <div className="col-12" className='transaction-type-active'>
                            <p className="question-style">{constantValues.TRANSACTION_TYPE_LABEL}</p>
                            <RadioButton options={dropDownTransactionOptions} onRadioChanged={onTransactionChanged} id='trans-type-id'
                                images={transactionTypeImages} dafaultValue={values?.transaction?.transactionTypeId} />
                        </div>
                    </div>
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

export default TransactionType