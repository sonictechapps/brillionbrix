import React, { useEffect, useState } from 'react'
import { Accordion, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import '../sass/quotesummary.scss'
import { constantValues, leData } from '../utils/constants'
import { getColor, getStingOnLanguage, monthNames, ordinal_suffix_of, setColor, setLanguage } from '../utils/utility'
import AccordionItem from '../atomiccomponent/AccordionItem'
import ToggleButtonWithLabel from '../atomiccomponent/ToggleButtonWithLabel'
import ConfirmationModalPortal from './ConfirmationModalPortal'
import ConversationSummaryModal from './ConversationSummaryModal'
import { useNavigate, useLocation } from 'react-router'
import queryString from 'query-string'
import { jsPDF } from "jspdf"
import 'jspdf-autotable'

function LEQuoteSummary() {
  const dispatch = useDispatch()
  const history = useNavigate()
  const location = useLocation()
  const languageId = queryString.parse(location.search).languageid
  const companyId = queryString.parse(location.search).companyid
  setLanguage(languageId)
  //const { titleCompanyInfo, titleChargesQuote, recordingFee, propertyAddress, listOfEndorsements, totalSellerEstimate, selectedTransactionTypes, disclaimer, quoteCreatedOn } = location.state.data
  const { titleCompanyInfo, titleInsurance, loanEstimateQuotes, adjustments, propertyAddress, listOfEndorsements, selectedTransactionTypes, disclaimer, quoteCreatedOn } = leData
  const address = propertyAddress
  const [themeColor, setThemeColor] = useState(getColor());
  const [insurencePremierObj, setInsurencePremierObj] = useState()
  const [loanEstimateQuotesObj, setLoanEstimateQuotesObj] = useState()
  const [adjustmentsObj, setAdjustmentsObj] = useState()
  const [listOfEndorsementsArr, setListOfEndorsementsArr] = useState(listOfEndorsements)
  const [modalShowPortal, setModalShowPortal] = useState(false)
  const [summaryModalShowPortal, setSummaryModalShowPortal] = useState(false)
  const [endorsementObject, setEndorsementObjet] = useState()
  const { transactionTypeId, transactionType, titleInsuranceOwner, loanAmount, salePrice  } = selectedTransactionTypes
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
        title: titleCompanyInfo.companyName
      }
    })
  }, [])

  const getTotal = (arr, key) => {
    if (arr?.length > 0) {
      let res = arr && arr.reduce(function (previousValue, currentValue) {
        const value = isInt(parseInt(currentValue[key])) ? parseInt(currentValue[key]) : parseInt(currentValue[key]).toFixed(2)
        console.log(value)
        return parseInt(previousValue) + value
      }, 0);
      return res
    } else {
      return arr ? (arr !== null && arr[key]) ? isInt(arr[key]) ? arr[key] : arr[key].toFixed(2) : 0 : 0
    }
  }


  const filteredEndorsement = () => {console.log(listOfEndorsementsArr);
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
      header: languageId==="en"?adjustments.description:adjustments.description_es,
      total: getTotal(adjustments.fees, "buyerAdjAmt"),
      eventKey: '4',
      value: [adjustments.fees],
      keys: [['description', 'buyerAdjAmt']]
    })
    


    // if(titleChargesQuote && recordingFee){
    //   titleChargesQuote.buyerEstimate.titleInsurances.forEach((obj)=>{
    //     if(obj.titleInsuranceDescription.includes("Title Insurance")){
    //       pdfRow.push({name:"Title policy", buyerFees:obj.titleInsuranceFee, sellerFees:titleChargesQuote.sellerEstimate.titleInsurances[0].titleInsuranceFee });
    //     }
    //   })
    //   listOfEndorsementsArr.forEach(obj=>{
    //     pdfRow.push({name:obj.endorsementDescription, buyerFees:obj.endorsementFee, sellerFees:"" });
    //   })
    //   titleChargesQuote.buyerEstimate.settlementFees.forEach((obj)=>{
    //     const sellerFees =titleChargesQuote.sellerEstimate.settlementFees.filter(data=>(obj.miscFeeId === data.miscFeeId));
    //     settlementPdfRow.push({miscFeeId:obj.miscFeeId, miscFeeName:obj.miscFeeName, miscFeeName_es : obj.miscFeeName_es, 
    //       buyerFees:obj.miscFee, sellerFees:sellerFees[0].miscFee });
        
    //   })
    //   recordingFee.buyerRecordingFee.forEach((obj)=>{
    //     const sellerFees =recordingFee.sellerRecordingFee.filter(data=>(obj.recordingFeeDesc === data.recordingFeeDesc));
    //     recordingPdfRow.push({recordingFeeDesc:obj.recordingFeeDesc, recordingFeeDesc_es:obj.recordingFeeDesc_es, buyerFees : obj.recordingFee, 
    //       sellerFees:sellerFees[0].recordingFee });
        
    //   })
      
    // }

  }, [JSON.stringify(titleInsurance)])

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
    resetLoanEstimateObj();
    setModalShowPortal(false)
  }

  const resetLoanEstimateObj = () => {
    setInsurencePremierObj({
      header: getStingOnLanguage('INSURENCE_PREMIUM'),
      total: getTotal(titleInsurance.fees, "buyerEstimate") + getTotal(filteredEndorsement(), "endorsementFee"),
      eventKey: '0',
      value: [titleInsurance.fees, filteredEndorsement()],
      keys: [['description', 'buyerEstimate'], ['endorsementDescription', 'endorsementFee']]
    })
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
    let loanEstimateQuotesAmount = 0 ;
    loanEstimateQuotes.forEach((obj)=>(loanEstimateQuotesAmount+getTotal(obj.fees, "buyerAdjAmt")))
     const total =getTotal(titleInsurance.fees, "buyerEstimate") +
     getTotal(filteredEndorsement(), "endorsementFee") +
     loanEstimateQuotesAmount+
     getTotal(adjustments.fees, "buyerAdjAmt");

    return isInt(total) ? total : parseFloat(total).toFixed(2);
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
    const entireCreatedArr = quoteCreatedOn.split(" ")
    const onlyDate = entireCreatedArr[0].split('-');
    return `${ordinal_suffix_of(onlyDate[1])} ${monthNames[parseInt(onlyDate[2] - 1)]}, ${onlyDate[0]} `;
  }


  const onPDFGenerate = () => {
  
    var doc = new jsPDF();
    

      // From HTML
    var finalY = doc.lastAutoTable.finalY || 10
    doc.text(`Title quote provided by ABC title, Created on - `+ getCreateDate(), 14, finalY + 15)

    doc.autoTable({
      startY: finalY + 30,
      html: '#print-table',
      useCss: true,tableLineColor: [0, 0, 0],
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
      useCss: true,tableLineColor: [0, 0, 0],
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
        <div className="download">
        <img src="images/download.png" alt="download as pdf" width="50px" onClick={onPDFGenerate}/>
        </div>
        <div className="row content">

          <div className="col-sm-12 mt-3">


            {titleCompanyInfo
              && <h2 className="labelstyle-quote">{getStingOnLanguage('TITLE_QUOTE_PROVIDED')} {titleCompanyInfo.companyName}. </h2>}
            {quoteCreatedOn &&
              <span className="question-style"> {getStingOnLanguage('CREATED_ON')} {getCreateDate()}</span>
            }
            <div>
              {propertyAddress &&
                <p className="question-style">{getAddress()} <a className='summary-anchor' onClick={onConSummaryClick}>{getStingOnLanguage('CONVERSATION_SUMMARY')}</a></p>
              }
            </div>
            {loanEstimateQuotes && loanEstimateQuotes.map((obj, key)=>(
            <div className="row">
              <div className={className}>
                <div className="box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
                  <div className="box-icon" style={{ backgroundColor: themeColor }}>
                    <span className="fa fa-4x fa-html5"><h4 className="text-center">$
                      {loanEstimateQuotes && getTotal(obj.fees, "buyerAdjAmt")}</h4></span>
                  </div>
                  <div className="info">
                    <h4 className="text-center">{ languageId==="en"?obj.description:obj.description_es}</h4>

                  </div>
                  
                    <Accordion defaultActiveKey={[key+""]} flush alwaysOpen>
                        <AccordionItem acordionArray={{
                            header: languageId==="en"?obj.description:obj.description_es,
                            total: getTotal(obj.fees, "buyerAdjAmt")+ getTotal(filteredEndorsement(), "endorsementFee"),
                            eventKey: key+"",
                            value: key==="0"?[obj.fees, filteredEndorsement()]:[obj.fees],
                            keys: [['description', 'buyerAdjAmt'], ['endorsementDescription', 'endorsementFee']]
                          }} />
                    </Accordion>
                  

                </div>


              </div>
            </div>
            ))}
            <div className="row">
              <div className={className}>
                <div className="box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
                  <div className="box-icon" style={{ backgroundColor: themeColor }}>
                    <span className="fa fa-4x fa-html5"><h4 className="text-center">$
                      {adjustmentsObj && getTotal(adjustments.fees, "buyerAdjAmt")}</h4></span>
                  </div>
                  <div className="info">
                    <h4 className="text-center">{ getStingOnLanguage('BUYER')}</h4>

                  </div>
                  {adjustmentsObj &&
                    <Accordion defaultActiveKey={['0', '1', '2', '3', '4']} flush alwaysOpen>
                      {adjustmentsObj && <AccordionItem acordionArray={adjustmentsObj} />}
                    </Accordion>
                  }

                </div>


              </div>
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
        <ConversationSummaryModal modalshow={summaryModalShowPortal} onClose={onNoCallback} titleCompanyInfo={titleCompanyInfo} propertyAddress={propertyAddress?propertyAddress:{}}
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
            <td colSpan="1">{salePrice}</td>
            <td colSpan="1" className='pdf-title'>Loan Amount</td>
            <td colSpan="1">{loanAmount}</td>
          </tr>
        </tbody>
      </Table>
      
      <Table striped bordered hover id="print-table-2" className='hidetable'>
        
        <tbody>
          <tr>
            <td colSpan="2" className='align-cn pdf-heading'>Title Quote</td>
          </tr>
          <tr>
            <td colSpan="1"></td>
            <td colSpan="1">BUYER</td>
          </tr>
          {loanEstimateQuotes && loanEstimateQuotes.map((obj, key)=>(
            <>
          <tr>
            <td colSpan="1">{ languageId==="en"?obj.description:obj.description_es}</td>
            <td colSpan="1">${key===0?getTotal(obj.fees, "buyerAdjAmt")+ getTotal(filteredEndorsement(), "endorsementFee"):getTotal(obj.fees, "buyerAdjAmt")}</td>
          </tr>
            {obj.fees.length && obj.fees.map((data)=>(
              <tr>
              <td colSpan="1" className="align-rt">{languageId==="en"?data.description:data.description_es}</td>
              <td colSpan="1" className="align-rt">${data.buyerAdjAmt}</td>
            </tr>
            ))}
            {key ===0 && filteredEndorsement().map(obj=>(
              <tr>
              <td colSpan="1" className="align-rt">{obj.endorsementDescription}</td>
              <td colSpan="1" className="align-rt">${obj.endorsementFee}</td>
            </tr>
            ))}
            </>
          ))}
           <tr>
            <td colSpan="1" className="align-rt">Total</td>
            <td colSpan="1">${getBuyerTotal()}</td>
          </tr>
        </tbody>
      </Table>
    </React.Fragment>
  )
}

export default LEQuoteSummary
