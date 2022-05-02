import React, { useEffect, useState } from 'react'
import { Accordion, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import '../sass/quotesummary.scss'
import { constantValues, leData } from '../utils/constants'
import { addCommaInNumber, getColor, getStingOnAPILanguage, getStingOnLanguage, getTotal, isInt, monthNames, ordinal_suffix_of, setColor, setLanguage } from '../utils/utility'
import AccordionItem from '../atomiccomponent/AccordionItem'
import ToggleButtonWithLabel from '../atomiccomponent/ToggleButtonWithLabel'
import ConfirmationModalPortal from './ConfirmationModalPortal'
import ConversationSummaryModal from './ConversationSummaryModal'
import { useNavigate, useLocation } from 'react-router'
import queryString from 'query-string'
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import moment from 'moment'

function CDQuoteSummery() {
  const dispatch = useDispatch()
  const history = useNavigate()
  const location = useLocation()
  const languageId = queryString.parse(location.search).languageid
  const companyId = queryString.parse(location.search).companyid
  setLanguage(languageId)
  const { titleCompanyInfo, loanEstimateQuotes, adjustments, propertyAddress, selectedTransactionTypes, disclaimer, quoteCreatedOn } = location.state.data
  //const { titleCompanyInfo,  loanEstimateQuotes, adjustments, propertyAddress, listOfEndorsements, selectedTransactionTypes, disclaimer, quoteCreatedOn } = leData
  const address = propertyAddress
  const [themeColor, setThemeColor] = useState(getColor());
  const [insurencePremierObj, setInsurencePremierObj] = useState()
  const [loanEstimateQuotesObj, setLoanEstimateQuotesObj] = useState()
  const [adjustmentsObj, setAdjustmentsObj] = useState({})
  const [listOfEndorsementsArr, setListOfEndorsementsArr] = useState(location.state.data.listOfEndorsements !== undefined ? location.state.data.listOfEndorsements : [])
  const [modalShowPortal, setModalShowPortal] = useState(false)
  const [summaryModalShowPortal, setSummaryModalShowPortal] = useState(false)
  const [endorsementObject, setEndorsementObjet] = useState()
  const { transactionTypeId, transactionType, titleInsuranceOwner, loanAmount, salePrice } = selectedTransactionTypes
  const isRefinance = transactionTypeId !== undefined && (transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE || transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE_CASH_OUT) ? true : false
  const className = "col-12";
  const [pdfRow, setPdfRow] = useState([]);
  const [settlementPdfRow, setSettlementPdfRow] = useState([]);
  const [recordingPdfRow, setRecordingPdfRow] = useState([])
  const estimateArr = ['buyerEstimateAmount', 'sellerEstimateAmount']
  useEffect(() => {

    let companyInfo = titleCompanyInfo

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


  const filteredEndorsement = () => {
    const arr = listOfEndorsementsArr?.filter((endorse, index) => endorse.defaultEnabled)
    return arr
  }

  useEffect(() => {
    resetLoanEstimateObj()
    // setLoanEstimateQuotesObj({
    //   header: getStingOnLanguage('SETTLEMENT_FEES'),
    //   total: getTotal(loanEstimateQuotes.fees, "buyerEstimate"),
    //   eventKey: '1',
    //   value: [loanEstimateQuotes.fees],
    //   keys: [['description', 'buyerEstimate']]
    // })
    setAdjustmentsObj({
      header: languageId === "en" ? ((adjustments !== null && adjustments !== undefined) ? adjustments.description : "") : ((adjustments !== null && adjustments !== undefined) ? adjustments.description_es : ""),
      total: getTotal((adjustments !== null && adjustments !== undefined && adjustments.fees !== undefined) ? adjustments.fees : [], "buyerEstimateAmount"),
      eventKey: '4',
      value: [(adjustments !== null && adjustments !== undefined && adjustments.fees !== undefined) ? adjustments.fees : []],
      keys: [['description', 'buyerEstimateAmount']]
    })



  }, [JSON.stringify(adjustments)])

  const handleChange = (obj) => {
    setEndorsementObjet(obj)
    setModalShowPortal(true)

  }

  const onYesCallback = () => {
    listOfEndorsementsArr.forEach(data => {
      if (endorsementObject.endorsementId == data.endorsementId) {
        data.defaultEnabled = !data.defaultEnabled;
      }
    })
    setListOfEndorsementsArr([...listOfEndorsementsArr])
    resetLoanEstimateObj();
    setModalShowPortal(false)
  }

  const resetLoanEstimateObj = () => {
    // setInsurencePremierObj({
    //   header: getStingOnLanguage('INSURENCE_PREMIUM'),
    //   total: getTotal(titleInsurance.fees, "buyerEstimate") + getTotal(filteredEndorsement(), "endorsementFee"),
    //   eventKey: '0',
    //   value: [titleInsurance.fees, filteredEndorsement()],
    //   keys: [['description', 'buyerEstimate'], ['endorsementDescription', 'endorsementFee']]
    // })
  }

  const onNoCallback = () => {
    setModalShowPortal(false)
    setSummaryModalShowPortal(false)
    resetLoanEstimateObj()
  }

  const onConSummaryClick = () => {
    setSummaryModalShowPortal(true)
  }

  const getBuyerTotal = () => {
    let loanEstimateQuotesAmount = 0;
    loanEstimateQuotes.forEach((obj) => (
      loanEstimateQuotesAmount = loanEstimateQuotesAmount + getTotal(obj.fees, "buyerEstimateAmount")))
    const total = getTotal(filteredEndorsement(), "endorsementFee") + loanEstimateQuotesAmount + (adjustments !== null ? getTotal(adjustments.fees, "buyerEstimateAmount") : 0);

    return isInt(total) ? total : parseFloat(total).toFixed(2);
  }

  const getSellerTotal = () => {
    let loanEstimateQuotesAmount = 0;
    loanEstimateQuotes.forEach((obj) => (
      loanEstimateQuotesAmount = loanEstimateQuotesAmount + getTotal(obj.fees, "sellerEstimateAmount")))
    const total = loanEstimateQuotesAmount + (adjustments !== null ? getTotal(adjustments.fees, "buyerEstimateAmount") : 0);

    return isInt(total) ? total : parseFloat(total).toFixed(2);
  }


  const onStartOverClick = () => {
    dispatch({
      type: 'RESET_INPUT_DATA'
    })
    history({
      pathname: `/closingdisclouseestimte`,

      search: `?languageid=${languageId}&companyid=${companyId}`
    })
  }

  const getAddress = () => {

    return `${address.streetNumber | ''} ${address.streetName || ''}, ${address.condo ? `${getStingOnLanguage('UNIT')}${address.condo}, ` : ''}${address.city}, ${address.state}, ${address.county}`
  }



  const getCreateDate = () => {
    return moment(new Date(quoteCreatedOn)).format('Do MMMM YYYY')
  }


  const onPDFGenerate = () => {

    var doc = new jsPDF();


    // From HTML
    var finalY = doc.lastAutoTable.finalY || 10
    doc.setFontSize(14)
    doc.text(`${getStingOnLanguage('CLOSING_DISCLOSURE')} ${getStingOnLanguage('TITLE_QUOTE_PROVIDED')} ${titleCompanyInfo.companyName}`, 50, finalY + 15)
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
      startY: finalY + 80,
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
    doc.save('summary.pdf')

  }

  const ShowOrHideTable = (fees) => {
    const sellerEstimateAmount = fees?.sellerEstimateAmount || '0.0'
    const buyerEstimateAmount = fees?.buyerEstimateAmount || '0.0'
    return !['0', '0.0', '0.00'].includes(sellerEstimateAmount) || !['0', '0.0', '0.00'].includes(buyerEstimateAmount)
  }


  return (
    <React.Fragment>
      <div className="container container-fluid">
        <p className='start-over-output' onClick={onStartOverClick} >{getStingOnLanguage('START_OVER')}</p>
        <div className="row content">

          <div className="col-sm-12 mt-3" style={{ textAlign: 'center' }}>


            {titleCompanyInfo
              && <div><h2 className="labelstyle-quote">{`${getStingOnLanguage('CLOSING_DISCLOSURE')} ${getStingOnLanguage('TITLE_QUOTE_PROVIDED')} ${titleCompanyInfo.companyName}.`} </h2></div>}
            {quoteCreatedOn &&
              <p className="question-style-output"> {getStingOnLanguage('CREATED_ON')} {getCreateDate()}</p>
            }
            <div className="download" onClick={onPDFGenerate}>
              <img src="images/download.png" alt="download as pdf" width="50px" />
              <span className='download-text'>{getStingOnLanguage('DOWNLOAD_SPAN')}</span>
            </div>
            <div>
              {propertyAddress &&
                <p className="question-style-output">{getAddress()} <a className='summary-anchor' onClick={onConSummaryClick}>{getStingOnLanguage('CONVERSATION_SUMMARY')}</a></p>
              }
            </div>
            <div className="box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
              <div>

                <div className='table1'>
                  <div className='table1-cell header'>
                  </div>
                  <div className={!isRefinance ? 'table1-cell header' : 'table1-cell-refinance header'}>
                    <span>{getStingOnLanguage('BUYER')}</span>
                  </div>
                  {
                    !isRefinance && (
                      <div className='table1-cell header'>
                        <span>{getStingOnLanguage('SELLER')}</span>
                      </div>
                    )
                  }

                </div>
                {loanEstimateQuotes?.length > 0 && loanEstimateQuotes?.map((obj, key) => (
                  <>
                    <div className='table1'>
                      <div className='table1-cell desc-header-main header'>
                        <span>{getStingOnAPILanguage(obj, 'description')}</span>
                      </div>
                      <div className={!isRefinance ? 'table1-cell' : 'table1-cell-refinance'}>
                        <span>$ {obj?.sectionId == 'C' ? (getTotal(obj.fees, "buyerEstimateAmount") + getTotal(filteredEndorsement(), "endorsementFee")).toFixed(2) : getTotal(obj.fees, "buyerEstimateAmount").toFixed(2)}</span>
                      </div>
                      {
                        !isRefinance && (
                          <div className='table1-cell'>
                            <span>$ {getTotal(obj.fees, "sellerEstimateAmount").toFixed(2)}</span>
                          </div>
                        )
                      }

                    </div>
                    {
                      obj?.sectionId == 'C' && filteredEndorsement().map(endorse => (
                        <>
                          {
                            <div className='table1'>
                              <div className='table1-cell desc-header'>
                                <span>{getStingOnAPILanguage(endorse, 'endorsementDescription')}</span>
                              </div>
                              <div className={!isRefinance ? 'table1-cell' : 'table1-cell-refinance'}>
                                <span>$ {endorse.endorsementFee.toFixed(2)}</span>
                              </div>
                              {
                                !isRefinance && (
                                  <div className='table1-cell'>
                                  </div>
                                )
                              }

                            </div>
                          }
                        </>

                      ))
                    }
                    {
                      obj?.fees.map(fees => (
                        <>
                          {
                            ShowOrHideTable(fees) && (
                              <div className='table1'>
                                <div className='table1-cell desc-header'>
                                  <span>{getStingOnAPILanguage(fees, 'description')}</span>
                                </div>
                                <div className={!isRefinance ? 'table1-cell' : 'table1-cell-refinance'}>
                                  <span>$ {parseFloat(fees.buyerEstimateAmount !== null ? fees.buyerEstimateAmount : 0.00).toFixed(2) || 0.00}</span>
                                </div>
                                {
                                  !isRefinance && (
                                    <div className='table1-cell'>
                                      <span>$ {parseFloat(fees.sellerEstimateAmount !== null ? fees.sellerEstimateAmount : 0.00).toFixed(2) || 0.00}</span>
                                    </div>
                                  )
                                }

                              </div>
                            )
                          }
                        </>

                      ))
                    }
                  </>
                ))
                }
                <div className='table1'>
                  <div className='table1-cell'>
                    <span style={{ fontWeight: 'bold' }}>{getStingOnLanguage('TOTAL')}</span>
                  </div>
                  <div className={!isRefinance ? 'table1-cell' : 'table1-cell-refinance'}>
                    <span style={{ fontWeight: 'bold' }}>$ {getBuyerTotal()}</span>
                  </div>
                  {
                    !isRefinance && (
                      <div className='table1-cell'>
                        <span style={{ fontWeight: 'bold' }}>$ {getSellerTotal()}</span>
                      </div>
                    )
                  }

                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <p className="review-text">{getStingOnLanguage('QUOTE_SUMMARY_ENDORSEMENT_RECOMMENDATION')}</p>
            </div>

            {listOfEndorsementsArr?.map((obj) =>
              <div className="col-12 col-md-6">
                <ToggleButtonWithLabel endorseMent={obj} handleChange={handleChange} />
              </div>
            )}
            <div className="col-12">
              <p style={{ marginTop: '100px' }}>{disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
      {
        <ConfirmationModalPortal modalContent={getStingOnLanguage('CONFIRM_MODAL')}
          modalshow={modalShowPortal} onYesCallback={onYesCallback} onNoCallback={onNoCallback} />
      }
      {
        <ConversationSummaryModal modalshow={summaryModalShowPortal} onClose={onNoCallback} titleCompanyInfo={titleCompanyInfo} propertyAddress={propertyAddress ? propertyAddress : {}}
          selectedTransactionTypes={selectedTransactionTypes} />
      }


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
            <td colSpan="3">{titleCompanyInfo?.companyBranchName}</td>
          </tr>
          <tr>
            <td colSpan="1" className='pdf-title'>{getStingOnLanguage('TITLE_INSU_PAID_BY')}</td>
            <td colSpan="1">{titleInsuranceOwner}</td>
            <td colSpan="1" className='pdf-title'>{getStingOnLanguage('TRANSACTION_TYPE_SPAN')}</td>
            <td colSpan="1">{transactionType}</td>
          </tr>
          <tr>
            <td colSpan="1" className='pdf-title'>{getStingOnLanguage('SALES_PRICE')}</td>
            <td colSpan="1">${addCommaInNumber(salePrice)}</td>
            <td colSpan="1" className='pdf-title'>{getStingOnLanguage('LOAN_AMOUNT_SPAN')}</td>
            <td colSpan="1">${addCommaInNumber(loanAmount)}</td>
          </tr>
        </tbody>
      </Table>

      <Table striped bordered hover id="print-table-2" className='hidetable'>

        <tbody>
          <tr>
            <td colSpan="3" className='align-cn pdf-heading'>{getStingOnLanguage('TITLE_QUOTE_SPAN')}</td>
          </tr>
          <tr>
            <td colSpan="1"></td>
            <td colSpan={isRefinance ? '2' : '1'}>{getStingOnLanguage('BUYER')}</td>
            <td colSpan="1">{getStingOnLanguage('SELLER')}</td>
          </tr>
          {loanEstimateQuotes.length > 0 && loanEstimateQuotes.map((obj, key) => (
            <>
              <tr>
                <td colSpan="1">{getStingOnAPILanguage(obj, 'description')}</td>
                <td colSpan={isRefinance ? '2' : '1'}>${obj?.sectionId == 'C' ? (getTotal(obj.fees, "buyerEstimateAmount") + getTotal(filteredEndorsement(), "endorsementFee")).toFixed(2) : getTotal(obj.fees, "buyerEstimateAmount").toFixed(2)}</td>
                <td colSpan="1">${getTotal(obj.fees, "sellerEstimateAmount").toFixed(2)}</td>
              </tr>

              {obj?.sectionId == 'C' && filteredEndorsement() && filteredEndorsement().map(obj => (
                <tr>
                  <td colSpan="1" className="align-rt">{getStingOnAPILanguage(obj, 'endorsementDescription')}</td>
                  <td colSpan={isRefinance ? '2' : '1'} className="align-rt">${obj.endorsementFee.toFixed(2)}</td>
                  <td></td>
                </tr>
              ))}
              {obj?.fees?.length > 0 && obj?.fees?.map((data) => (
                <>
                  {
                    ShowOrHideTable(data) && (
                      <tr>
                        <td colSpan="1" className="align-rt">{getStingOnAPILanguage(data, 'description')}</td>
                        <td colSpan={isRefinance ? '2' : '1'} className="align-rt">${parseFloat(data.buyerEstimateAmount !== null ? data.buyerEstimateAmount : 0.00).toFixed(2) || 0.00}</td>
                        <td colSpan="1" className="align-rt">${parseFloat(data.sellerEstimateAmount !== null ? data.sellerEstimateAmount : 0.00).toFixed(2) || 0.00}</td>
                      </tr>
                    )
                  }
                </>

              ))}
            </>
          ))}
          <tr>
            <td colSpan="1" className="align-rt">{getStingOnLanguage('TOTAL')}</td>
            <td colSpan={isRefinance ? '2' : '1'}>${getBuyerTotal()}</td>
            <td colSpan="1">${getSellerTotal()}</td>
          </tr>
        </tbody>
      </Table>
    </React.Fragment>
  )
}

export default CDQuoteSummery
