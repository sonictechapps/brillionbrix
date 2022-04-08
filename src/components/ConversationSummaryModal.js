import React from 'react'
import ReactDOM from 'react-dom'
import { constantValues } from '../utils/constants'
import CollapseDetails from './CollpaseDetails'
import '../sass/converstionsummarymodal.scss'
import '../sass/inputscreen.scss'
import ModalCard from '../atomiccomponent/ModalCard'
import { getStingOnLanguage } from '../utils/utility'


const ConversationSummaryModal = ({ modalshow, onClose, propertyAddress, selectedTransactionTypes, titleCompanyInfo }) => {
    const addCommaInNumber = (number) => {
        
        const nonDecimal = number.split('.')[0].split('')
        const decimal = number.split('.')[1]
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
                <span>{getStingOnLanguage('TRANSACTION_TYPE_SPAN')} {selectedTransactionTypes?.transactionType}</span>
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE && (
                        <>
                            <span>{getStingOnLanguage('REFINANCE_OPTION_SPAN')} {selectedTransactionTypes?.refinanceOption}</span>
                            <span>{getStingOnLanguage('LOAN_AMOUNT_SPAN')} {`$ ${addCommaInNumber(selectedTransactionTypes?.loanAmount)}`}</span>
                        </>
                    )
                }
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE_CASH_OUT && (
                        <>
                            <span>{getStingOnLanguage('REFINANCE_OPTION_SPAN')} {selectedTransactionTypes?.refinanceOption}</span>
                            <span>{getStingOnLanguage('LOAN_AMOUNT_SPAN')} {`$ ${addCommaInNumber(selectedTransactionTypes?.loanAmount)}`}</span>
                            <span>{getStingOnLanguage('NEW_LOAN_AMOUNT_SPAN')} {`$ ${addCommaInNumber(selectedTransactionTypes?.refiCashOutAmount)}`}</span>
                        </>
                    )
                }
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_PURCHASE_WITH_CASH && (
                        <>
                            <span>{getStingOnLanguage('TITLE_INSURENCE_OWNER_SPAN')} {selectedTransactionTypes?.titleInsuranceOwner}</span>
                            <span>{getStingOnLanguage('SALES_PRICE_SPAN')} {`$ ${addCommaInNumber(selectedTransactionTypes?.salePrice)}`}</span>
                        </>
                    )
                }
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_PURCHASE_WITH_FINANCE && (
                        <>
                            <span>{getStingOnLanguage('TITLE_INSURENCE_OWNER_SPAN')} {selectedTransactionTypes?.titleInsuranceOwner}</span>
                            <span>{getStingOnLanguage('LOAN_AMOUNT_SPAN')} {`$ ${addCommaInNumber(selectedTransactionTypes?.loanAmount)}`}</span>
                            <span>{getStingOnLanguage('SALES_PRICE_SPAN')} {`$ ${addCommaInNumber(selectedTransactionTypes?.salePrice)}`}</span>
                        </>
                    )
                }
            </>
        )
    }

    const getAddress = () => {
        const address =  `${propertyAddress.streetNumber | ''} ${propertyAddress.streetName || ''}, ${propertyAddress.condo? `${getStingOnLanguage('UNIT')}${propertyAddress.condo}, `: ''}${propertyAddress.city}, ${propertyAddress.state}, ${propertyAddress.county}`
        return (
            <span>{`${getStingOnLanguage('LOCATION_SPAN')} ${address}`}</span>
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

                                    <div className="col-12 dropDownCollapse-active">
                                        <CollapseDetails htmlContent={<span>{`${getStingOnLanguage('BRANCH_SPAN')} ${titleCompanyInfo?.companyBranchName}`}</span>} showEdit={false} />
                                    </div>

                                </div>
                            </ModalCard>
                            <ModalCard>
                                <div className="row">

                                    <div className="col-12 dropDownCollapse-active">
                                        <CollapseDetails htmlContent={getAddress()} showEdit={false} />
                                    </div>

                                </div>
                            </ModalCard>
                            <ModalCard>
                                <div className="row">
                                    <div className="col-12 dropDownCollapse-active">
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