import React from 'react'
import ReactDOM from 'react-dom'
import { constantValues } from '../utils/constants'
import CollapseDetails from './CollpaseDetails'
import '../sass/converstionsummarymodal.scss'
import '../sass/inputscreen.scss'
import ModalCard from '../atomiccomponent/ModalCard'


const ConversationSummaryModal = ({ modalshow, onClose, propertyAddress, selectedTransactionTypes, titleCompanyInfo }) => {
    console.log('propertyAddress', propertyAddress)
    const addCommaInNumber = (number) => {
        
        const nonDecimal = number.split('.')[0].split('')
        const decimal = number.split('.')[1]
        console.log('nonDecimal', nonDecimal)
        let i = 0
        for(let j= nonDecimal.length-1; j>= 0; j--) {
            if(i%3 === 0 && (j!==nonDecimal.length-1)) {
               nonDecimal[j] =  nonDecimal[j] + ','
            }
            i++
        }
        return decimal? `${nonDecimal.join('')}.${decimal}` : nonDecimal.join('')
    }
    
    const getHtmlContent = () => {
        return (
            <>
                <span>{constantValues.TRANSACTION_TYPE_SPAN} {selectedTransactionTypes?.transactionType}</span>
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE && (
                        <>
                            <span>{constantValues.REFINANCE_OPTION_SPAN} {selectedTransactionTypes?.refinanceOption}</span>
                            <span>{constantValues.LOAN_AMOUNT_SPAN} {`$ ${addCommaInNumber(selectedTransactionTypes?.loanAmount)}`}</span>
                        </>
                    )
                }
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE_CASH_OUT && (
                        <>
                            <span>{constantValues.REFINANCE_OPTION_SPAN} {selectedTransactionTypes?.refinanceOption}</span>
                            <span>{constantValues.LOAN_AMOUNT_SPAN} {`$ ${addCommaInNumber(selectedTransactionTypes?.loanAmount)}`}</span>
                            <span>{constantValues.NEW_LOAN_AMOUNT_SPAN} {`$ ${addCommaInNumber(selectedTransactionTypes?.refiCashOutAmount)}`}</span>
                        </>
                    )
                }
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_PURCHASE_WITH_CASH && (
                        <>
                            <span>{constantValues.TITLE_INSURENCE_OWNER_SPAN} {selectedTransactionTypes?.titleInsuranceOwner}</span>
                            <span>{constantValues.SALES_PRICE_SPAN} {`$ ${addCommaInNumber(selectedTransactionTypes?.salePrice)}`}</span>
                        </>
                    )
                }
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_PURCHASE_WITH_FINANCE && (
                        <>
                            <span>{constantValues.TITLE_INSURENCE_OWNER_SPAN} {selectedTransactionTypes?.titleInsuranceOwner}</span>
                            <span>{constantValues.LOAN_AMOUNT_SPAN} {`$ ${addCommaInNumber(selectedTransactionTypes?.loanAmount)}`}</span>
                            <span>{constantValues.SALES_PRICE_SPAN} {`$ ${addCommaInNumber(selectedTransactionTypes?.salePrice)}`}</span>
                        </>
                    )
                }
            </>
        )
    }

    const getAddress = () => {
        const address =  `${propertyAddress.streetNumber | ''} ${propertyAddress.streetName || ''}, ${propertyAddress.condo? `Unit #${propertyAddress.condo}, `: ''}${propertyAddress.city}, ${propertyAddress.state}, ${propertyAddress.county}`
        return (
            <span>{`${constantValues.LOCATION_SPAN} ${address}`}</span>
        )
    }
    return (
        ReactDOM.createPortal(
            <div className={`modal-summary ${modalshow && 'show-modal-summary'}`}>
                <div className="modal-content-summary">
                    <div className="modal-body">
                        <span className="close" onClick={(e) => onClose(e)}>&times;</span>
                        <div style={{ marginTop: '40px' }}>
                            <ModalCard>
                                <div className="row">

                                    <div className="col-12" className='dropDownCollapse-active'>
                                        <CollapseDetails htmlContent={<span>{`${constantValues.BRANCH_SPAN} ${titleCompanyInfo?.companyBranchName}`}</span>} showEdit={false} />
                                    </div>

                                </div>
                            </ModalCard>
                            <ModalCard>
                                <div className="row">

                                    <div className="col-12" className='dropDownCollapse-active'>
                                        <CollapseDetails htmlContent={getAddress()} showEdit={false} />
                                    </div>

                                </div>
                            </ModalCard>
                            <ModalCard>
                                <div className="row">
                                    <div className="col-12" className='dropDownCollapse-active'>
                                        <CollapseDetails htmlContent={getHtmlContent()} showEdit={false} />
                                    </div>
                                </div>
                            </ModalCard>
                        </div>
                    </div>
                </div>
            </div>, document.getElementById('modal-summary-portal')
        )
    )
}

export default ConversationSummaryModal