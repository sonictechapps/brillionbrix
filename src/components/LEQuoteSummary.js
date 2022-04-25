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

function LEQuoteSummary() {
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
  const className = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
  const [pdfRow, setPdfRow] = useState([]);
  const [settlementPdfRow, setSettlementPdfRow] = useState([]);
  const [recordingPdfRow, setRecordingPdfRow] = useState([]);
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


  const onStartOverClick = () => {
    dispatch({
      type: 'RESET_INPUT_DATA'
    })
    history({
      pathname: `/loanestimate`,

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
    doc.text(`${getStingOnLanguage('TITLE_QUOTE_PROVIDED')} ${titleCompanyInfo.companyName}`, 50, finalY + 15)
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


  return (
    <React.Fragment>
      <div className="container container-fluid">
        <p className='start-over-output' onClick={onStartOverClick} >{getStingOnLanguage('START_OVER')}</p>
        <div className="row content">

          <div className="col-sm-12 mt-3">


            {titleCompanyInfo
              && <div><h2 className="labelstyle-quote">{getStingOnLanguage('TITLE_QUOTE_PROVIDED')} {titleCompanyInfo.companyName}. </h2></div>}
            {quoteCreatedOn &&
              <span className="question-style-output"> {getStingOnLanguage('CREATED_ON')} {getCreateDate()}</span>
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
            {loanEstimateQuotes?.length > 0 && loanEstimateQuotes?.map((obj, key) => (
              <>
                {obj?.fees?.length > 0 && <div className="row">
                  <div className={className}>
                    <div className="box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
                      <div className="box-icon" style={{ backgroundColor: themeColor }}>
                        <span className="fa fa-4x fa-html5"><h4 className="text-center">$
                          {loanEstimateQuotes && obj.sectionId === 'C' ? getTotal(obj.fees, "buyerEstimateAmount") + getTotal(filteredEndorsement(), "endorsementFee") :
                            getTotal(obj.fees, "buyerEstimateAmount")}</h4></span>
                      </div>
                      <div className="info">
                        <h4 className="text-center">{getStingOnAPILanguage(obj, 'description')}</h4>

                      </div>

                      <Accordion defaultActiveKey={[key + ""]} flush alwaysOpen>
                        <AccordionItem acordionArray={{
                          header: getStingOnAPILanguage(obj, 'description'),
                          total: obj.sectionId === 'C' ? getTotal(obj.fees, "buyerEstimateAmount") + getTotal(filteredEndorsement(), "endorsementFee") :
                            getTotal(obj.fees, "buyerEstimateAmount"),
                          eventKey: key + "",
                          value: obj.sectionId === 'C' ? [obj.fees, filteredEndorsement()] : [obj.fees],
                          keys: [['description', 'buyerEstimateAmount'], ['endorsementDescription', 'endorsementFee']]
                        }} />
                      </Accordion>
                    </div>
                  </div>
                </div>}
              </>
            ))}
            {adjustments !== null && adjustments !== undefined && adjustmentsObj?.fees?.length > 0 &&
              <div className="row">
                <div className={className}>
                  <div className="box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
                    <div className="box-icon" style={{ backgroundColor: themeColor }}>
                      <span className="fa fa-4x fa-html5"><h4 className="text-center">$
                        {adjustmentsObj && getTotal(adjustments.fees, "buyerEstimateAmount")}</h4></span>
                    </div>
                    <div className="info">
                      <h4 className="text-center">{getStingOnLanguage('BUYER')}</h4>

                    </div>
                    {adjustmentsObj &&
                      <Accordion defaultActiveKey={['0', '1', '2', '3', '4']} flush alwaysOpen>
                        {adjustmentsObj && <AccordionItem acordionArray={adjustmentsObj} />}
                      </Accordion>
                    }

                  </div>


                </div>
              </div>}
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
            <td colSpan="2" className='align-cn pdf-heading'>{getStingOnLanguage('TITLE_QUOTE_SPAN')}</td>
          </tr>
          <tr>
            <td colSpan="1"></td>
            <td colSpan="1">{getStingOnLanguage('BUYER')}</td>
          </tr>

          {loanEstimateQuotes && loanEstimateQuotes.map((obj, key) => (
            <>
              <tr>
                <td colSpan="1">{getStingOnAPILanguage(obj, 'description')}</td>
                <td colSpan="1">${key === 0 ? getTotal(obj.fees, "buyerEstimateAmount") + getTotal(filteredEndorsement(), "endorsementFee") : getTotal(obj.fees, "buyerEstimateAmount")}</td>
              </tr>
              {obj.fees.length && obj.fees.map((data) => (
                <>
                  {
                    (data.buyerEstimateAmount !== null && parseInt(data.buyerEstimateAmount) !== 0) && (
                      <tr>
                        <td colSpan="1" className="align-rt">{getStingOnAPILanguage(data, 'description')}</td>
                        <td colSpan="1" className="align-rt">${data.buyerEstimateAmount}</td>
                      </tr>
                    )
                  }
                </>

              ))}
              {key === 0 && filteredEndorsement().map(obj => (
                <>
                  {
                    (obj.endorsementFee !== null && parseInt(obj.endorsementFee) !== 0) && (
                  <tr>
                    <td colSpan="1" className="align-rt">{getStingOnAPILanguage(obj, 'endorsementDescription')}</td>
                    <td colSpan="1" className="align-rt">${obj.endorsementFee}</td>
                  </tr>
                  )
                }
                </>

              ))}
            </>
          ))}
          <tr>
            <td colSpan="1" className="align-rt">{getStingOnLanguage('TOTAL')}</td>
            <td colSpan="1">${getBuyerTotal()}</td>
          </tr>
        </tbody>
      </Table>
    </React.Fragment>
  )
}

export default LEQuoteSummary
