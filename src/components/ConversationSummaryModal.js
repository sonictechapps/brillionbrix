import React from 'react'
import ReactDOM from 'react-dom'
import { constantValues } from '../utils/constants'
import CollapseDetails from './CollpaseDetails'
import '../sass/converstionsummarymodal.scss'
import '../sass/inputscreen.scss'
import ModalCard from '../atomiccomponent/ModalCard'
import { getStingOnLanguage } from '../utils/utility'


const ConversationSummaryModal = ({ modalshow, onClose, propertyAddress, selectedTransactionTypes, titleCompanyInfo, sellerNetSheetTransDetails, sellerNetSheetHOA }) => {
    const addCommaInNumber = (number) => {

        const nonDecimal = number.split('.')[0].split('')
        const decimal = number.split('.')[1]
        let i = 0
        for (let j = nonDecimal.length - 1; j >= 0; j--) {
            if (i % 3 === 0 && (j !== nonDecimal.length - 1)) {
                nonDecimal[j] = nonDecimal[j] + ','
            }
            i++
        }
        return decimal ? `${nonDecimal.join('')}.${decimal}` : nonDecimal.join('')
    }

    const getSalesPriceDetails = () => {
        return (
            <>
                <span>{`${getStingOnLanguage('SALES_PRICE')}: $${addCommaInNumber(sellerNetSheetTransDetails?.salePrice)}`}</span>
                <span>{`${getStingOnLanguage('DEFAULT_CLOSING_DATE')}: ${sellerNetSheetTransDetails?.defaultClosingDate}`}</span>
                <span>{`${getStingOnLanguage('TITLE_INSU_PAID_BY')}: ${sellerNetSheetTransDetails?.titleInsuranceOwner}`}</span>
            </>
        )
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
        const address = `${propertyAddress.streetNumber | ''} ${propertyAddress.streetName || ''}, ${propertyAddress.condo ? `${getStingOnLanguage('UNIT')}${propertyAddress.condo}, ` : ''}${propertyAddress.city}, ${propertyAddress.state}, ${propertyAddress.county}`
        return (
            <span>{`${getStingOnLanguage('LOCATION_SPAN')} ${address}`}</span>
        )
    }

    const getMortgageDetails = () => {
        return (
            <>
                <span>{`${getStingOnLanguage('PRIMARY_MORTGAGE')}: $${addCommaInNumber(sellerNetSheetTransDetails?.primaryMortgage)}`}</span>
                <span>{`${getStingOnLanguage('SECONDARY_MORTGAGE')}: $${addCommaInNumber(sellerNetSheetTransDetails?.secondaryMortage)}`}</span>
            </>
        )
    }

    const getCommissionDetails = () => {
        return (
            <>
                <span>{`${getStingOnLanguage('BUYER_AGENT_COMMISSION')}: $${addCommaInNumber(sellerNetSheetTransDetails?.buyerAgentCommission)}`}</span>
                <span>{`${getStingOnLanguage('LISTING_AGENT_COMMISSION')}: $${addCommaInNumber(sellerNetSheetTransDetails?.listingAgentCommission)}`}</span>
            </>
        )
    }

    const getHOADetails= () => {
        return (
            <>
            {
                <span>{`${getStingOnLanguage('HOA_TYPE')}: ${sellerNetSheetHOA.hoaOptionDescription}`}</span>
            }
            {
                sellerNetSheetHOA.hoaOptionId !== constantValues.NO_HOA_ID.toString() && (
                    <>
                    <span>{`${getStingOnLanguage('HOA_AMOUNT')}: $${addCommaInNumber(sellerNetSheetHOA?.hoaOptionAmount)}`}</span>
                    <span>{`${getStingOnLanguage('HOA_PAID_BY_SELLER')}: ${sellerNetSheetHOA.hoaDuePaidBySeller ? `${getStingOnLanguage('YES')}` : `${getStingOnLanguage('NO')}`}`}</span>
                    </>
                )
            }
            </>
        )
    }

    const propertyTaxDetails = () => {
        return (
            <>
             <span>{`${getStingOnLanguage('PROPERTY_TAX')}: ${sellerNetSheetTransDetails.propertyTaxId === constantValues.PROPERTY_TAX_RATE_ID ? `${sellerNetSheetTransDetails.propertyTaxRate}%` : `$${sellerNetSheetTransDetails.propertyTaxValue}`}`}</span>
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
                            {
                                selectedTransactionTypes && (
                                    <ModalCard>
                                        <div className="row">
                                            <div className="col-12 dropDownCollapse-active">
                                                <CollapseDetails htmlContent={getHtmlContent()} showEdit={false} />
                                            </div>
                                        </div>
                                    </ModalCard>
                                )
                            }
                            {
                                sellerNetSheetTransDetails && (
                                    <>
                                        <ModalCard>
                                            <div className="row">
                                                <div className="col-12 dropDownCollapse-active">
                                                    <CollapseDetails htmlContent={getSalesPriceDetails()} showEdit={false} />
                                                </div>
                                            </div>
                                        </ModalCard>
                                        <ModalCard>
                                            <div className="row">
                                                <div className="col-12 dropDownCollapse-active">
                                                    <CollapseDetails htmlContent={getMortgageDetails()} showEdit={false} />
                                                </div>
                                            </div>
                                        </ModalCard>
                                        <ModalCard>
                                            <div className="row">
                                                <div className="col-12 dropDownCollapse-active">
                                                    <CollapseDetails htmlContent={getCommissionDetails()} showEdit={false} />
                                                </div>
                                            </div>
                                        </ModalCard>

                                    </>
                                )
                            }
                            {
                                sellerNetSheetHOA && (
                                    <ModalCard>
                                        <div className="row">
                                            <div className="col-12 dropDownCollapse-active">
                                                <CollapseDetails htmlContent={getHOADetails()} showEdit={false} />
                                            </div>
                                        </div>
                                    </ModalCard>
                                )
                            }
                            {
                                sellerNetSheetTransDetails && (
                                    <ModalCard>
                                        <div className="row">
                                            <div className="col-12 dropDownCollapse-active">
                                                <CollapseDetails htmlContent={propertyTaxDetails()} showEdit={false} />
                                            </div>
                                        </div>
                                    </ModalCard>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>, document.getElementById('modal-summary-portal')
        )
    )
}

export default ConversationSummaryModal