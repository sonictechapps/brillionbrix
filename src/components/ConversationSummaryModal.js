import React from 'react'
import ReactDOM from 'react-dom'
import { constantValues } from '../utils/constants'
import CollapseDetails from './CollpaseDetails'
import '../sass/converstionsummarymodal.scss'
import '../sass/inputscreen.scss'
import Card from '../atomiccomponent/Card'


const ConversationSummaryModal = ({ modalshow, onClose, propertyAddress, selectedTransactionTypes, titleCompanyInfo }) => {

    const getHtmlContent = () => {
        return (
            <>
                <span>{constantValues.TRANSACTION_TYPE_SPAN} {selectedTransactionTypes?.transactionType}</span>
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE && (
                        <>
                            <span>{constantValues.REFINANCE_OPTION_SPAN} {selectedTransactionTypes?.refinanceOptionsDesc}</span>
                            <span>{constantValues.LOAN_AMOUNT_SPAN} {`$ ${selectedTransactionTypes?.loanAmount}`}</span>
                        </>
                    )
                }
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE_CASH_OUT && (
                        <>
                            <span>{constantValues.REFINANCE_OPTION_SPAN} {selectedTransactionTypes?.refinanceOptionsDesc}</span>
                            <span>{constantValues.LOAN_AMOUNT_SPAN} {`$ ${selectedTransactionTypes?.loanAmount}`}</span>
                            <span>{constantValues.NEW_LOAN_AMOUNT_SPAN} {`$ ${selectedTransactionTypes?.refiCashOutAmount}`}</span>
                        </>
                    )
                }
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_PURCHASE_WITH_CASH && (
                        <>
                            <span>{constantValues.TITLE_INSURENCE_OWNER_SPAN} {selectedTransactionTypes?.titleInsuranceOwner}</span>
                            <span>{constantValues.SALES_PRICE_SPAN} {`$ ${selectedTransactionTypes?.salePrice}`}</span>
                        </>
                    )
                }
                {
                    selectedTransactionTypes?.transactionTypeId === constantValues.TRANSACTION_TYPE_PURCHASE_WITH_FINANCE && (
                        <>
                            <span>{constantValues.TITLE_INSURENCE_OWNER_SPAN} {selectedTransactionTypes?.titleInsuranceOwner}</span>
                            <span>{constantValues.LOAN_AMOUNT_SPAN} {`$ ${selectedTransactionTypes?.loanAmount}`}</span>
                            <span>{constantValues.SALES_PRICE_SPAN} {`$ ${selectedTransactionTypes?.salePrice}`}</span>
                        </>
                    )
                }
            </>
        )
    }
    return (
        ReactDOM.createPortal(
            <div className={`modal-summary ${modalshow && 'show-modal-summary'}`}>
                <div className="modal-content-summary">
                    <div className="modal-body">
                        <span className="close" onClick={(e) => onClose(e)}>&times;</span>
                        <div style={{ marginTop: '40px' }}>
                            <Card>
                                <div className="row">

                                    <div className="col-12" className='dropDownCollapse-active'>
                                        <CollapseDetails htmlContent={<span>{`${constantValues.BRANCH_SPAN} ${titleCompanyInfo?.companyBranchName}`}</span>} showEdit={false} />
                                    </div>

                                </div>
                            </Card>
                            <Card>
                                <div className="row">

                                    <div className="col-12" className='dropDownCollapse-active'>
                                        <CollapseDetails htmlContent={<span>{`${constantValues.LOCATION_SPAN} ${propertyAddress?.apt || ''} ${propertyAddress?.streetNumber}, ${propertyAddress?.streetName}, 
                                ${propertyAddress?.city}, ${propertyAddress?.zipCode}, ${propertyAddress?.state}, ${propertyAddress?.county}`}</span>} showEdit={false} />
                                    </div>

                                </div>
                            </Card>
                            <Card>
                                <div className="row">
                                    <div className="col-12" className='dropDownCollapse-active'>
                                        <CollapseDetails htmlContent={getHtmlContent()} showEdit={false} />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>, document.getElementById('modal-summary-portal')
        )
    )
}

export default ConversationSummaryModal