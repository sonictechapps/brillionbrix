import React, { useEffect, useState } from 'react'
import { Accordion, Table } from 'react-bootstrap'
import { addCommaInNumber, getColor, getStingOnAPILanguage, getStingOnLanguage, getTotal, isInt, setColor, setLanguage } from '../utils/utility'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import queryString from 'query-string'
import moment from 'moment'

import AccordionItem from '../atomiccomponent/AccordionItem'
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import { constantValues } from '../utils/constants'
import '../sass/quotesummary.scss'
import ConversationSummaryModal from './ConversationSummaryModal'

const SellerNetSheetQuoteSummary = () => {
    const dispatch = useDispatch()
    const history = useNavigate()
    const location = useLocation()
    const languageId = queryString.parse(location.search).languageid
    const companyId = queryString.parse(location.search).companyid
    setLanguage(languageId)
    const [themeColor, setThemeColor] = useState(getColor())
    const { titleCompanyInfo, propertyAddress, sellerNetProceedsDetails, disclaimer, quoteCreatedOn, totalSellerProceeds } = location.state.data
    // const address = location.state.companyInfo.propertyAddress
    const { propertyAddress: address, selectedTransactionTypes: transactioType, otherExpenses, selectedHOA } = location.state.companyInfo
    const [summaryModalShowPortal, setSummaryModalShowPortal] = useState(false)

    useEffect(() => {
        let companyInfo = location.state.companyInfo.titleCompanyInfo
        if (companyInfo?.companyBGColor) {
            setColor(companyInfo.companyBGColor)
            setThemeColor(companyInfo.companyBGColor)
        }
        dispatch({
            type: 'SET_COLOR',
            data: {
                color: getColor(),
                title: titleCompanyInfo.companyName,
                logo: titleCompanyInfo.companyLogoURL
            }
        })
    }, [])

    const onStartOverClick = () => {
        dispatch({
            type: 'SELLER_NET_SHEET_RESET_INPUT_DATA'
        })
        history({
            pathname: `/sellernetsheetinput`,
            search: `?languageid=${languageId}&companyid=${companyId}`
        })
    }

    const onPDFGenerate = () => {
        var doc = new jsPDF();
        // From HTML
        var finalY = doc.lastAutoTable.finalY || 10
        doc.setFontSize(14)
        doc.text(`${getStingOnLanguage('SELLER_NET_SHEET')} ${getStingOnLanguage('TITLE_QUOTE_PROVIDED')} ${titleCompanyInfo.companyName}`, 50, finalY + 15)
        doc.setFontSize(10)
        doc.setLineHeightFactor(2)
        doc.text(`${getStingOnLanguage('CREATED_ON')} - ${getCreateDate()}`, 70, finalY + 25)
        doc.autoTable({
            startY: finalY + 30,
            html: '#print-table',
            useCss: true, tableLineColor: [0, 0, 0],
            tableLineWidth: .25,
            styles: {
                lineColor: [0, 0, 0],
                lineWidth: .25,
            },
            headStyles: {
                fillColor: [241, 196, 15],
                fontSize: 12,
            },
            footStyles: {
                fillColor: [241, 196, 15],
                fontSize: 12,
            },
            bodyStyles: {
                fillColor: [0, 0, 0],
                textColor: 240,
            },
            alternateRowStyles: {
                fillColor: [74, 96, 117],
            },
        })

        doc.autoTable({
            startY: finalY + 140,
            html: '#print-table-2',
            useCss: true, tableLineColor: [0, 0, 0],
            tableLineWidth: .25,
            styles: {
                lineColor: [0, 0, 0],
                lineWidth: .25,
            },
            headStyles: {
                fillColor: [241, 196, 15],
                fontSize: 12,
            },
            footStyles: {
                fillColor: [241, 196, 15],
                fontSize: 12,
            },
            bodyStyles: {
                fillColor: [0, 0, 0],
                textColor: 240,
            },
            alternateRowStyles: {
                fillColor: [74, 96, 117],
            },
        })

        //doc.output('dataurlnewwindow')
        doc.save('sellernetsheet.pdf')
    }

    const getAddress = () => {
        return `${address.streetNumber | ''} ${address.streetName || ''}, ${address.condo ? `${getStingOnLanguage('UNIT')}${address.condo}, ` : ''}${address.city}, ${address.state}, ${address.county}`
    }

    const getCreateDate = () => {
        return moment(new Date(quoteCreatedOn)).format('Do MMMM YYYY')
    }

    const onConSummaryClick = () => {
        setSummaryModalShowPortal(true)
    }

    const onNoCallback = () => {
        setSummaryModalShowPortal(false)
    }

    const isFloat = (val) => {
        if (val.includes('.')) {
            return parseFloat(val)
        } else {
            return parseInt(val)
        }
    }

    // const getTotal = (arr, key) => {
    //     if (arr?.length > 0) {
    //         let res = arr && arr.reduce(function (previousValue, currentValue) {
    //             if (currentValue[key]) {
    //                 const updatedCurrenctValue = isFloat(currentValue[key])
    //                 const value = isInt(updatedCurrenctValue) ? updatedCurrenctValue : updatedCurrenctValue.toFixed(2)
    //                 return previousValue + value
    //             } else {
    //                 return previousValue
    //             }
    //         }, 0);
    //         return res
    //     } else {
    //         return arr ? (arr !== null && arr[key]) ? isInt(isFloat(arr[key])) ? isFloat(arr[key]) : isFloat(arr[key]).toFixed(2) : 0 : 0
    //     }
    // }

    const getSellerTotal = () => {
        // const total = getTotal(sellerNetProceedsDetails.fees, "sellerEstimateAmount") +
        //   getTotal(titleChargesQuote.buyerEstimate.settlementFees, "miscFee") +
        //   recordingFee.buyerTotalRecordingFee
        // return isInt(total) ? total : parseFloat(total).toFixed(2)
        if (sellerNetProceedsDetails.length > 0) {
            let total = 0
            sellerNetProceedsDetails.forEach(sellerdetails => {
                const value = getTotal(sellerdetails.fees, "sellerEstimateAmount")
                total = total + value
            })
            return isInt(total) ? total : parseFloat(total).toFixed(2)
        } else {
            return 0
        }

    }

    const getAccordionArray = () => {
        let arr = []
        for (let i = 0; i < sellerNetProceedsDetails.length; i++) {
            arr.push(i.toString())
        }
        return arr
    }

    const sellerAccordionArray = (obj, index) => {
        return {
            header: getStingOnAPILanguage(obj, 'description'),
            total: getTotal(obj.fees, "sellerEstimateAmount"),
            eventKey: index.toString(),
            value: [obj.fees],
            keys: [['description', 'sellerEstimateAmount']],
            isShowDetails: true
        }
    }

    const ShowOrHideTable = (fees) => {
        const sellerEstimateAmount = fees?.sellerEstimateAmount || '0.0'
        return parseInt(sellerEstimateAmount) !== 0
    }

    return (
        <React.Fragment>
            <div className="container container-fluid">
                <p className='start-over-output' onClick={onStartOverClick} >{getStingOnLanguage('START_OVER')}</p>
                <div className="row content">
                    <div className="col-sm-12 mt-3">
                        {titleCompanyInfo
                            && <div><h2 className="labelstyle-quote">{getStingOnLanguage('SELLER_NET_SHEET')} {getStingOnLanguage('TITLE_QUOTE_PROVIDED')} {titleCompanyInfo.companyName}. </h2></div>}
                        {quoteCreatedOn &&
                            <span className="question-style-output"> {getStingOnLanguage('CREATED_ON')} {getCreateDate()}</span>
                        }
                        <div className="download" onClick={onPDFGenerate}>
                            <img src="images/download.png" alt="download as pdf" width="50px" />
                            <span className='download-text'>{getStingOnLanguage('DOWNLOAD_SPAN')}</span>
                        </div>
                        <div className='conv-summary'>
                            {propertyAddress &&
                                <p className="question-style-output">{getAddress()} <a className='summary-anchor' onClick={onConSummaryClick}>{getStingOnLanguage('CONVERSATION_SUMMARY')}</a></p>
                            }
                        </div>
                        <Table striped bordered hover id="print-table" className='hidetable'>

                            <tbody>
                                <tr>
                                    <td colSpan="4" className='align-cn pdf-heading'>{getStingOnLanguage('CONVERSATION_HISTORY')}</td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('PROPERTY_ADDRESS')}</td>
                                    <td colSpan="3">{getAddress()}</td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('BRANCH_SPAN')}</td>
                                    <td colSpan="1">{titleCompanyInfo?.companyBranchName}</td>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('SALES_PRICE')}</td>
                                    <td colSpan="1">${addCommaInNumber(transactioType.salePrice)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('DEFAULT_CLOSING_DATE')}</td>
                                    <td colSpan="1">{transactioType.defaultClosingDate}</td>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('TITLE_INSU_PAID_BY')}</td>
                                    <td colSpan="1">{transactioType.titleInsuranceOwner}</td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('PRIMARY_MORTGAGE')}</td>
                                    <td colSpan="1">{`$${addCommaInNumber(transactioType.primaryMortgage)}`}</td>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('SECONDARY_MORTGAGE')}</td>
                                    <td colSpan="1">{`$${addCommaInNumber(transactioType.secondaryMortage)}`}</td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('BUYER_AGENT_COMMISSION')}</td>
                                    <td colSpan="1">{`$${addCommaInNumber(transactioType.buyerAgentCommission)}`}</td>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('LISTING_AGENT_COMMISSION')}</td>
                                    <td colSpan="1">{`$${addCommaInNumber(transactioType.listingAgentCommission)}`}</td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('HOA_TYPE')}</td>
                                    <td colSpan="3">{`${selectedHOA.hoaOptionDescription}`}</td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('HOA_AMOUNT')}</td>
                                    <td colSpan="1">{`$${addCommaInNumber(selectedHOA.hoaOptionAmount)}`}</td>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('HOA_PAID_BY_SELLER')}</td>
                                    <td colSpan="1">{transactioType.hoaDuePaidBySeller ? `${getStingOnLanguage('YES')}` : `${getStingOnLanguage('NO')}`}</td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className='pdf-title'>{getStingOnLanguage('PROPERTY_TAX')}</td>
                                    <td colSpan="3">{transactioType.propertyTaxId === constantValues.PROPERTY_TAX_RATE_ID ? `${transactioType.propertyTaxRate}%` : `$${transactioType.propertyTaxValue}`}</td>
                                </tr>

                            </tbody>
                        </Table>
                        <Table striped bordered hover id="print-table-2" className='hidetable'>
                            <tbody>
                                <tr>
                                    <td colSpan="2" className='align-cn pdf-heading'>{getStingOnLanguage('SELLER_NET_SHEET_QUOTE')}</td>
                                </tr>
                                {
                                    sellerNetProceedsDetails.length > 0 && sellerNetProceedsDetails.map((seller) => (
                                        <>
                                            {
                                                seller?.description && (
                                                    <tr>
                                                        {
                                                            seller?.description && <td colSpan="1" className='align-lt'>{getStingOnAPILanguage(seller, 'description')}</td>
                                                        }

                                                        {
                                                            seller?.fees && seller?.fees.length > 0 ? <td colSpan="1" className='align-lt'>${getTotal(seller.fees, "sellerEstimateAmount")}</td> :
                                                                <td colSpan="1" className='align-lt'>$0</td>
                                                        }
                                                    </tr>

                                                )
                                            }
                                            {
                                                seller?.fees && seller?.fees.length > 0 && seller?.fees.map((sellerfees) => (
                                                    <>
                                                        {
                                                            ShowOrHideTable(sellerfees) && (
                                                                <tr>
                                                                    <td colSpan="1" className="align-rt">{getStingOnAPILanguage(sellerfees, 'description')}</td>
                                                                    <td colSpan="1" className="align-rt">${sellerfees?.sellerEstimateAmount || '0'}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    </>

                                                ))

                                            }
                                        </>






                                    ))
                                }
                                <tr>
                                    <td colSpan="1" className="align-lt">{getStingOnLanguage('TOTAL')}</td>
                                    <td colSpan="1" className="align-rt">${totalSellerProceeds && addCommaInNumber(parseInt(totalSellerProceeds?.sellerEstimateAmount).toString())}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <div className="row">
                            <div className='col-12'>
                                <div className="box quote-box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
                                    <div className="box-icon" style={{ backgroundColor: themeColor }}>
                                        <span className="fa fa-4x fa-html5"><h4 className="text-center">$
                                            {totalSellerProceeds && addCommaInNumber(parseInt(totalSellerProceeds?.sellerEstimateAmount).toString())}</h4></span>
                                    </div>
                                    {
                                        sellerNetProceedsDetails.length > 0 && (
                                            <Accordion defaultActiveKey={getAccordionArray()} flush alwaysOpen>
                                                {
                                                    sellerNetProceedsDetails.map((seller, index) => (
                                                        seller.description && <AccordionItem acordionArray={sellerAccordionArray(seller, index)} />
                                                    ))
                                                }
                                            </Accordion>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="col-12">
                                <p style={{ marginTop: '100px', textAlign: 'left' }}>{disclaimer}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {
                <ConversationSummaryModal modalshow={summaryModalShowPortal} onClose={onNoCallback} titleCompanyInfo={titleCompanyInfo} propertyAddress={address}
                    sellerNetSheetTransDetails={transactioType} sellerNetSheetHOA={selectedHOA} />
            }
        </React.Fragment>
    )
}

export default SellerNetSheetQuoteSummary