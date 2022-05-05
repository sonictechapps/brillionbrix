import React from 'react'
import ReactDOM from 'react-dom'
import { constantValues } from '../utils/constants'
import CollapseDetails from './CollpaseDetails'
import '../sass/converstionsummarymodal.scss'
import '../sass/inputscreen.scss'
import ModalCard from '../atomiccomponent/ModalCard'
import { getColor, getStingOnAPILanguage, getStingOnLanguage } from '../utils/utility'


const ConversationSummaryModal = ({ modalshow, onClose, propertyAddress, selectedTransactionTypes, titleCompanyInfo, sellerNetSheetTransDetails, sellerNetSheetHOA, buyerNetSheetTransDetails,
    loanDetails, lenderFees }) => {
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

    const getBuyerSalesPriceDetails = () => {
        return (
            <>
                <span>{`${getStingOnLanguage('SALES_PRICE')}: $${addCommaInNumber(buyerNetSheetTransDetails?.salePrice)}`}</span>
                <span>{`${getStingOnLanguage('DEFAULT_CLOSING_DATE')}: ${buyerNetSheetTransDetails?.defaultClosingDate}`}</span>
                <span>{`${getStingOnLanguage('TITLE_INSU_PAID_BY')}: ${buyerNetSheetTransDetails?.titleInsuranceOwner}`}</span>
                <span>{`${getStingOnLanguage('TRANSACTION_TYPE_SPAN')}: ${buyerNetSheetTransDetails?.transactionTypeName}`}</span>
            </>
        )
    }

    const getLenderDetails = () => {
        return (
            <>
                {
                    lenderFees.length > 0 && lenderFees.map(val => (
                        <span>{val.description}: ${addCommaInNumber(val.amount)}</span>
                    ))
                }
            </>
        )
    }

    const getBuyerLoanDetails = () => {
        return (
            <>
                <span>{getStingOnLanguage('LOAN_TYPE_SPAN')} {getStingOnAPILanguage(loanDetails, 'description')}</span>
                <span>{getStingOnLanguage('LOAN_TERM_SPAN')} {getStingOnAPILanguage(loanDetails, 'loanTerm')}</span>
                {/* <span>{${loanTypeValue.loantype === '1' ? }}: {`${loanTypeValue.loantype === '3' ? '$' : ''}${loanTypeValue.downpaymentvalue}${loanTypeValue.loantype !== '3' ? '%' : ''}`}</span> */}
                <span>{`${getStingOnLanguage('DOWN_PAYMENT_AMOUNT_SPAN')}: $${addCommaInNumber(loanDetails.downpayment)}`}</span>
                <span>{getStingOnLanguage('INTEREST_RATE_SPAN')} {loanDetails.interestRate}%</span>
                {
                    loanDetails?.id === constantValues.LOAN_TYPE_FHA_ID.toString() &&
                    <span>{getStingOnLanguage('MIP_RATE_SPAN')} {loanDetails?.mipMonthlyRate}%</span>
                }
                {
                    loanDetails?.id === constantValues.LOAN_TYPE_CONVENTIONAL_ID.toString() &&
                    <span>{getStingOnLanguage('PMI_RATE_SPAN')} {loanDetails?.pmi}%</span>
                }
                {
                    loanDetails?.id === constantValues.LOAN_TYPE_FHA_ID.toString() &&
                    <span>{getStingOnLanguage('MIP_FINANACE_SPAN')} {getStingOnLanguage(loanDetails.isMipFinanced ? 'YES' : 'NO')}</span>
                }
                {
                    loanDetails?.id === constantValues.LOAN_TYPE_VA_ID.toString() &&
                    <span>{getStingOnLanguage('VA_FUNDING_SPAN')} {getStingOnLanguage(loanDetails.isVAFundingFeePaid === '1' ? 'YES' : 'NO')}</span>
                }
            </>
        )
    }

    const getBuyerPropertyTaxDetails = () => {
        return (
            <>
                <span>{`${getStingOnLanguage('HOME_INSURANCE')}: $${addCommaInNumber(buyerNetSheetTransDetails?.homeInsurnce)}`}</span>
                {buyerNetSheetTransDetails?.propertyTaxRate !== '' && <span>{`${getStingOnLanguage('PROPERTY_TAX')}: ${parseFloat(buyerNetSheetTransDetails?.propertyTaxRate).toFixed(2)}%`}</span>}
                {buyerNetSheetTransDetails?.propertyTaxValue !== '' && <span>{`${getStingOnLanguage('PROPERTY_TAX_VALUE')}: $${addCommaInNumber(buyerNetSheetTransDetails?.propertyTaxValue)}`}</span>}
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
                            <span>{getStingOnLanguage('SALES_PRICE_SPAN')} {`$ ${addCommaInNumber(selectedTransactionTypes?.salePrice)}`}</span>
                            <span>{getStingOnLanguage('LOAN_AMOUNT_SPAN')} {`$ ${addCommaInNumber(selectedTransactionTypes?.loanAmount)}`}</span>
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

    const getHOADetails = () => {
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
                            <div className="avtar-icon">
                                <img src={`images/avatar.png`} style={{ backgroundColor: getColor() }} />
                                <p>{getStingOnLanguage('HERE_ARE_THE_DETAILS_BELOW')}</p>
                            </div>
                            
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
                                buyerNetSheetTransDetails && (
                                    <>
                                        <ModalCard>
                                            <div className="row">
                                                <div className="col-12 dropDownCollapse-active">
                                                    <CollapseDetails htmlContent={getBuyerSalesPriceDetails()} showEdit={false} />
                                                </div>
                                            </div>
                                        </ModalCard>
                                        {
                                            buyerNetSheetTransDetails?.transactionType === constantValues.BUYER_PURCHASE_TYPE_PURCHASE_WITH_FINANCE && (
                                                <ModalCard>
                                                    <div className="row">
                                                        <div className="col-12 dropDownCollapse-active">
                                                            <CollapseDetails htmlContent={getBuyerLoanDetails()} showEdit={false} />
                                                        </div>
                                                    </div>
                                                </ModalCard>
                                            )
                                        }
                                        <ModalCard>
                                            <div className="row">
                                                <div className="col-12 dropDownCollapse-active">
                                                    <CollapseDetails htmlContent={getBuyerPropertyTaxDetails()} showEdit={false} />
                                                </div>
                                            </div>
                                        </ModalCard>
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
                                            buyerNetSheetTransDetails?.transactionType === constantValues.BUYER_PURCHASE_TYPE_PURCHASE_WITH_FINANCE && (
                                                <ModalCard>
                                                    <div className="row">
                                                        <div className="col-12 dropDownCollapse-active">
                                                            <CollapseDetails htmlContent={getLenderDetails()} showEdit={false} />
                                                        </div>
                                                    </div>
                                                </ModalCard>
                                            )
                                        }

                                    </>
                                )
                            }
                            {
                                sellerNetSheetTransDetails && sellerNetSheetHOA && (
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