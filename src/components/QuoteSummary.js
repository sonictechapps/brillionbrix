import React, { useEffect, useState } from 'react'
import { Accordion, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import '../sass/quotesummary.scss'
import { constantValues } from '../utils/constants'
import { getColor, getStingOnLanguage, monthNames, ordinal_suffix_of, setColor, setLanguage } from '../utils/utility'
import AccordionItem from '../atomiccomponent/AccordionItem'
import ToggleButtonWithLabel from '../atomiccomponent/ToggleButtonWithLabel'
import ConfirmationModalPortal from './ConfirmationModalPortal'
import ConversationSummaryModal from './ConversationSummaryModal'
import { useNavigate, useLocation } from 'react-router'
import queryString from 'query-string'
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import moment from 'moment'

function QuoteSummary() {
  const dispatch = useDispatch()
  const history = useNavigate()
  const location = useLocation()
  const languageId = queryString.parse(location.search).languageid
  const companyId = queryString.parse(location.search).companyid
  setLanguage(languageId)
  const { titleCompanyInfo, titleChargesQuote, recordingFee, propertyAddress, listOfEndorsements, totalSellerEstimate, selectedTransactionTypes, disclaimer, quoteCreatedOn } = location.state.data
  const address = location.state.companyInfo.propertyAddress
  const [themeColor, setThemeColor] = useState(getColor());
  const [insurencePremierObj, setInsurencePremierObj] = useState()
  const [settlementFeesObj, setsettlementFeesObj] = useState()
  const [recordingFeesObj, setRecordingFeesObj] = useState()
  const [sellerInsurencePremierObj, setSellerInsurencePremierObj] = useState()
  const [sellerSettlementFeesObj, setSellerSettlementFeesObj] = useState()
  const [sellerRecordingFeesObj, setSellerRecordingFeesObj] = useState()
  const [listOfEndorsementsArr, setListOfEndorsementsArr] = useState(listOfEndorsements)
  const [modalShowPortal, setModalShowPortal] = useState(false)
  const [summaryModalShowPortal, setSummaryModalShowPortal] = useState(false)
  const [endorsementObject, setEndorsementObjet] = useState()
  const { transactionTypeId, transactionType, titleInsuranceOwner, loanAmount, salePrice } = selectedTransactionTypes
  const isRefinance = transactionTypeId !== undefined && (transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE || transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE_CASH_OUT) ? true : false
  const className = isRefinance ? "col-xs-12 col-sm-12 col-md-12 col-lg-12" : "col-xs-12 col-sm-6 col-md-6 col-lg-6";
  const [pdfRow, setPdfRow] = useState([]);
  const [settlementPdfRow, setSettlementPdfRow] = useState([]);
  const [recordingPdfRow, setRecordingPdfRow] = useState([]);
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

  const getTotal = (arr, key) => {
    if (arr?.length > 0) {
      let res = arr && arr.reduce(function (previousValue, currentValue) {
        const value = isInt(currentValue[key]) ? currentValue[key] : currentValue[key].toFixed(2)
        return previousValue + value
      }, 0);
      return res
    } else {
      return arr ? (arr !== null && arr[key]) ? isInt(arr[key]) ? arr[key] : arr[key].toFixed(2) : 0 : 0
    }
  }


  const filteredEndorsement = () => {
    const arr = listOfEndorsementsArr?.filter((endorse, index) => endorse.defaultEnabled)
    return arr
  }

  useEffect(() => {
    resetInsurancePremiumObj()
    setsettlementFeesObj({
      header: getStingOnLanguage('SETTLEMENT_FEES'),
      total: getTotal(titleChargesQuote.buyerEstimate.settlementFees, "miscFee"),
      eventKey: '1',
      value: [titleChargesQuote.buyerEstimate.settlementFees],
      keys: [['miscFeeName', 'miscFee']]
    })
    setRecordingFeesObj({
      header: getStingOnLanguage('RECORDING_FEES'),
      total: recordingFee.buyerTotalRecordingFee,
      eventKey: '2',
      value: [recordingFee.buyerRecordingFee],
      keys: [['recordingFeeDesc', 'recordingFee']]
    })
    if (!isRefinance) {
      setSellerInsurencePremierObj({
        header: getStingOnLanguage('INSURENCE_PREMIUM'),
        total: getTotal(titleChargesQuote.sellerEstimate.titleInsurances, "titleInsuranceFee"),
        eventKey: '0',
        value: [titleChargesQuote.sellerEstimate.titleInsurances],
        keys: [['titleInsuranceDescription', 'titleInsuranceFee']]
      })
      setSellerSettlementFeesObj({
        header: getStingOnLanguage('SETTLEMENT_FEES'),
        total: getTotal(titleChargesQuote.sellerEstimate.settlementFees, "miscFee"),
        eventKey: '1',
        value: [titleChargesQuote.sellerEstimate.settlementFees],
        keys: [['miscFeeName', 'miscFee']]
      })
      setSellerRecordingFeesObj({
        header: getStingOnLanguage('RECORDING_FEES'),
        total: recordingFee.sellerTotalRecordingFee,
        eventKey: '2',
        value: [recordingFee.sellerRecordingFee],
        keys: [['recordingFeeDesc', 'recordingFee']]
      })

    }


    if (titleChargesQuote && recordingFee) {
      titleChargesQuote.buyerEstimate.titleInsurances.forEach((obj) => {
        if (obj.titleInsuranceDescription.includes("Title Insurance")) {
          pdfRow.push({ name: "Title policy", buyerFees: obj.titleInsuranceFee, sellerFees: !isRefinance ? titleChargesQuote?.sellerEstimate?.titleInsurances[0]?.titleInsuranceFee || [] : [] });
        }
      })
      listOfEndorsementsArr !== null && listOfEndorsementsArr.forEach(obj => {
        pdfRow.push({ name: obj.endorsementDescription, buyerFees: obj.endorsementFee, sellerFees: "" });
      })
      titleChargesQuote.buyerEstimate.settlementFees.forEach((obj) => {
        const sellerFees = !isRefinance ? titleChargesQuote.sellerEstimate.settlementFees.filter(data => (obj.miscFeeId === data.miscFeeId)) : [];
        settlementPdfRow.push({
          miscFeeId: obj.miscFeeId, miscFeeName: obj.miscFeeName, miscFeeName_es: obj.miscFeeName_es,
          buyerFees: obj.miscFee, sellerFees: sellerFees.length > 0 ? sellerFees[0].miscFee : []
        });

      })
      recordingFee.buyerRecordingFee.forEach((obj) => {
        const sellerFees = !isRefinance ? recordingFee.sellerRecordingFee.filter(data => (obj.recordingFeeDesc === data.recordingFeeDesc)) : [];
        recordingPdfRow.push({
          recordingFeeDesc: obj.recordingFeeDesc, recordingFeeDesc_es: obj.recordingFeeDesc_es, buyerFees: obj.recordingFee,
          sellerFees: sellerFees.length > 0 ? sellerFees[0].recordingFee : []
        });

      })

    }

  }, [JSON.stringify(titleChargesQuote)])

  const handleChange = (obj) => {
    setEndorsementObjet(obj)
    setModalShowPortal(true)

  }

  const isInt = (val) => {
    return val % 1 === 0
  }


  const onYesCallback = () => {
    listOfEndorsementsArr.forEach(data => {
      if (endorsementObject.endorsementId == data.endorsementId) {
        data.defaultEnabled = !data.defaultEnabled;
      }
    })
    setListOfEndorsementsArr([...listOfEndorsementsArr])
    resetInsurancePremiumObj();
    setModalShowPortal(false)
  }

  const resetInsurancePremiumObj = () => {
    setInsurencePremierObj({
      header: getStingOnLanguage('INSURENCE_PREMIUM'),
      total: getTotal(titleChargesQuote.buyerEstimate.titleInsurances, "titleInsuranceFee") + getTotal(filteredEndorsement(), "endorsementFee"),
      eventKey: '0',
      value: [titleChargesQuote.buyerEstimate.titleInsurances, filteredEndorsement()],
      keys: [['titleInsuranceDescription', 'titleInsuranceFee'], ['endorsementDescription', 'endorsementFee']]
    })
  }

  const onNoCallback = () => {
    setModalShowPortal(false)
    setSummaryModalShowPortal(false)
    resetInsurancePremiumObj()
  }

  const onConSummaryClick = () => {
    setSummaryModalShowPortal(true)
  }

  const getBuyerTotal = () => {
    const total = getTotal(titleChargesQuote.buyerEstimate.titleInsurances, "titleInsuranceFee") +
      getTotal(filteredEndorsement(), "endorsementFee") +
      getTotal(titleChargesQuote.buyerEstimate.settlementFees, "miscFee") +
      recordingFee.buyerTotalRecordingFee
    return isInt(total) ? total : parseFloat(total).toFixed(2)
  }

  const getSellerTotal = () => {
    const total = getTotal(titleChargesQuote.sellerEstimate.titleInsurances, "titleInsuranceFee") +
      getTotal(titleChargesQuote.sellerEstimate.settlementFees, "miscFee") +
      recordingFee.sellerTotalRecordingFee
    return isInt(total) ? total : parseFloat(total).toFixed(2)
  }

  const onStartOverClick = () => {
    dispatch({
      type: 'RESET_INPUT_DATA'
    })
    history({
      pathname: `/`,

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
    doc.text(`Title quote provided by ABC title, Created on - ` + getCreateDate(), 14, finalY + 15)

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


  return (
    <React.Fragment>
      <div className="container container-fluid">
        <p className='start-over-output' onClick={onStartOverClick} >{getStingOnLanguage('START_OVER')}</p>
        <div className="download">
          <img src="images/download.png" alt="download as pdf" width="50px" onClick={onPDFGenerate} />
        </div>
        <div className="row content">

          <div className="col-sm-12 mt-3">


            {titleCompanyInfo
              && <h2 className="labelstyle-quote">{getStingOnLanguage('TITLE_QUOTE_PROVIDED')} {titleCompanyInfo.companyName}. </h2>}
            {quoteCreatedOn &&
              <span className="question-style-output"> {getStingOnLanguage('CREATED_ON')} {getCreateDate()}</span>
            }
            <div className='conv-summary'>
              {propertyAddress &&
                <p className="question-style-output">{getAddress()} <a className='summary-anchor' onClick={onConSummaryClick}>{getStingOnLanguage('CONVERSATION_SUMMARY')}</a></p>
              }
            </div>
            <div className="row">
              <div className={className}>
                <div className="box quote-box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
                  <div className="box-icon" style={{ backgroundColor: themeColor }}>
                    <span className="fa fa-4x fa-html5"><h4 className="text-center">$
                      {titleChargesQuote && getBuyerTotal()}</h4></span>
                  </div>
                  <div className="info">
                    <h4 className="text-center">{isRefinance ? getStingOnLanguage('BORROWER') : getStingOnLanguage('BUYER')}</h4>

                  </div>
                  {titleChargesQuote &&
                    <Accordion defaultActiveKey={['0', '1', '2']} flush alwaysOpen>
                      {insurencePremierObj && <AccordionItem acordionArray={insurencePremierObj} />}
                      {settlementFeesObj && <AccordionItem acordionArray={settlementFeesObj} />}
                      {recordingFeesObj && <AccordionItem acordionArray={recordingFeesObj} />}
                    </Accordion>
                  }

                </div>


              </div>
              {!isRefinance &&
                <div className={className}>
                  <div className="box quote-box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
                    <div className="box-icon" style={{ backgroundColor: themeColor }}>
                      <span className="fa fa-4x fa-css3">
                        <h4 className="text-center">$
                          {titleChargesQuote && getSellerTotal()}</h4></span>
                    </div>
                    <div className="info">
                      <h4 className="text-center">{getStingOnLanguage('SELLER')}</h4>

                    </div>
                    {titleChargesQuote &&
                      <Accordion defaultActiveKey={['0', '1', '2']} flush alwaysOpen>
                        {sellerInsurencePremierObj && <AccordionItem acordionArray={sellerInsurencePremierObj} />}
                        {sellerSettlementFeesObj && <AccordionItem acordionArray={sellerSettlementFeesObj} />}
                        {sellerRecordingFeesObj && <AccordionItem acordionArray={sellerRecordingFeesObj} />}
                      </Accordion>
                    }
                  </div>
                </div>}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <p className="review-text">{getStingOnLanguage('QUOTE_SUMMARY_REVIEW_REQUEST')}</p>
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
        <ConversationSummaryModal modalshow={summaryModalShowPortal} onClose={onNoCallback} titleCompanyInfo={titleCompanyInfo} propertyAddress={location?.state?.companyInfo?.propertyAddress}
          selectedTransactionTypes={selectedTransactionTypes} />
      }


      <Table striped bordered hover id="print-table" className='hidetable'>

        <tbody>
          <tr>
            <td colSpan="4" className='align-cn pdf-heading'>Conversation History</td>
          </tr>
          <tr>
            <td colSpan="1" className='pdf-title'>Property Address</td>
            <td colSpan="3">{getAddress()}</td>
          </tr>
          <tr>
            <td colSpan="1" className='pdf-title'>Branch</td>
            <td colSpan="3">{titleCompanyInfo?.companyBranchName}</td>
          </tr>
          <tr>
            <td colSpan="1" className='pdf-title'>Title Insurance Paid by</td>
            <td colSpan="1">{titleInsuranceOwner}</td>
            <td colSpan="1" className='pdf-title'>Transaction Type</td>
            <td colSpan="1">{transactionType}</td>
          </tr>
          <tr>
            <td colSpan="1" className='pdf-title'>Sales Price</td>
            <td colSpan="1">${addCommaInNumber(salePrice)}</td>
            <td colSpan="1" className='pdf-title'>Loan Amount</td>
            <td colSpan="1">${addCommaInNumber(loanAmount)}</td>
          </tr>
        </tbody>
      </Table>
      <Table striped bordered hover id="print-table-2" className='hidetable'>

        <tbody>
          <tr>
            <td colSpan={isRefinance ? '2' : '3'} className='align-cn pdf-heading'>Title Quote</td>
          </tr>
          <tr>
            <td colSpan="1"></td>
            <td colSpan="1">BUYER</td>
            <td colSpan="1">SELLER</td>
          </tr>
          <tr>
            <td colSpan="1">Title Insurance</td>
            <td colSpan="1">${insurencePremierObj ? isInt(insurencePremierObj.total) ? insurencePremierObj.total : parseFloat(insurencePremierObj.total).toFixed(2) : ""}</td>
            <td colSpan="1">${sellerInsurencePremierObj ? isInt(sellerInsurencePremierObj.total) ? sellerInsurencePremierObj.total : parseFloat(sellerInsurencePremierObj.total).toFixed(2) : ""}</td>
          </tr>
          {pdfRow.length && pdfRow.map((obj) => (
            <tr>
              <td colSpan="1" className="align-rt">{obj.name}</td>
              <td colSpan="1" className="align-rt">${obj.buyerFees}</td>
              <td colSpan="1" className="align-rt">{obj.sellerFees !== "" && <>$</>}{obj.sellerFees}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="1">Settlement Charges</td>
            <td colSpan="1">${settlementFeesObj ? isInt(settlementFeesObj.total) ? settlementFeesObj.total : parseFloat(settlementFeesObj.total).toFixed(2) : ""}</td>
            <td colSpan="1">${sellerSettlementFeesObj ? isInt(sellerSettlementFeesObj.total) ? sellerSettlementFeesObj.total : parseFloat(sellerSettlementFeesObj.total).toFixed(2) : ""}</td>
          </tr>
          {settlementPdfRow.length && settlementPdfRow.map((obj) => (
            <tr>
              <td colSpan="1" className="align-rt">{obj.miscFeeName}</td>
              <td colSpan="1" className="align-rt">${obj.buyerFees}</td>
              <td colSpan="1" className="align-rt">${obj.sellerFees}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="1">Recording fees</td>
            <td colSpan="1">${recordingFeesObj ? isInt(recordingFeesObj.total) ? recordingFeesObj.total : parseFloat(recordingFeesObj.total).toFixed(2) : ""}</td>
            <td colSpan="1">${sellerRecordingFeesObj ? isInt(sellerRecordingFeesObj.total) ? sellerRecordingFeesObj.total : parseFloat(sellerRecordingFeesObj.total).toFixed(2) : ""}</td>
          </tr>
          {recordingPdfRow.length && recordingPdfRow.map((obj) => (
            <tr>
              <td colSpan="1" className="align-rt">{obj.recordingFeeDesc}</td>
              <td colSpan="1" className="align-rt">${obj.buyerFees}</td>
              <td colSpan="1" className="align-rt">${obj.sellerFees}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="1" className="align-rt"><b>Total</b></td>
            <td colSpan="1"><b>${getBuyerTotal()}</b></td>
            <td colSpan="1"><b>${!isRefinance ? getSellerTotal() : 0}</b></td>
          </tr>
        </tbody>
      </Table>
    </React.Fragment>
  )
}

export default QuoteSummary
