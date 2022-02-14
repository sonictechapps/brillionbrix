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
  const { transactionTypeId, transactionType, titleInsuranceOwner, loanAmount, salePrice  } = selectedTransactionTypes
  const isRefinance = transactionTypeId !== undefined && (transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE || transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE_CASH_OUT) ? true : false
  const className = isRefinance ? "col-xs-12 col-sm-12 col-md-12 col-lg-12" : "col-xs-12 col-sm-6 col-md-6 col-lg-6";

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
        title: titleCompanyInfo.companyName
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
    const entireCreatedArr = quoteCreatedOn.split(" ")
    const onlyDate = entireCreatedArr[0].split('-');
    return `${ordinal_suffix_of(onlyDate[1])} ${monthNames[parseInt(onlyDate[2] - 1)]}, ${onlyDate[0]} `;
  }

  const generateHTML = () => {
    const rr = document.createElement('P')
    rr.innerHTML ='tytu ttut'
    const capture = document.getElementById('capture1')
    var table = document.createElement('TABLE')
    table.style.fontSize = '4px'
    table.setAttribute('class', 'tablepdf')
    var convHistoryTh = document.createElement('TH')
    convHistoryTh.setAttribute('colspan', 4)
    convHistoryTh.innerHTML = 'Conversation History'

    var convHistoryTr = document.createElement('TR')
    convHistoryTr.appendChild(convHistoryTh)
    table.appendChild(convHistoryTr)
    capture.appendChild(table)
    capture.appendChild(rr)
    if (address) {
      var propAddressTd = document.createElement('TD')
      propAddressTd.setAttribute('colspan', 1)
      propAddressTd.innerHTML = 'Property Address'
      var propAddressAnsTd = document.createElement('TD')
      propAddressAnsTd.setAttribute('colspan', 3)
      propAddressAnsTd.innerHTML = getAddress()
      var propAddressTr = document.createElement('TR')
      propAddressTr.appendChild(propAddressTd)
      propAddressTr.appendChild(propAddressAnsTd)
      table.appendChild(propAddressTr)
    }

    if (titleCompanyInfo?.companyBranchName) {
      var branchTd = document.createElement('TD')
      branchTd.setAttribute('colspan', 1)
      branchTd.innerHTML = 'Branch'
      var branchAnsTd = document.createElement('TD')
      branchAnsTd.setAttribute('colspan', 3)
      branchAnsTd.innerHTML = titleCompanyInfo?.companyBranchName
      var branchTr = document.createElement('TR')
      branchTr.appendChild(branchTd)
      branchTr.appendChild(branchAnsTd)
      table.appendChild(branchTr)
    }

    if (transactionTypeId === constantValues.TRANSACTION_TYPE_PURCHASE_WITH_FINANCE) {
      var titleInsPaidTd = document.createElement('TD')
      titleInsPaidTd.setAttribute('colspan', 1)
      titleInsPaidTd.innerHTML = 'Title Insurance Paid by'
      var titleInsPaidAnsTd = document.createElement('TD')
      titleInsPaidAnsTd.setAttribute('colspan', 1)
      titleInsPaidAnsTd.innerHTML = titleInsuranceOwner

      var transactionTypeTd = document.createElement('TD')
      transactionTypeTd.setAttribute('colspan', 1)
      transactionTypeTd.innerHTML = 'Transaction Type'
      var transactionTypeAnsTd = document.createElement('TD')
      transactionTypeAnsTd.setAttribute('colspan', 1)
      transactionTypeAnsTd.innerHTML = transactionType
      var transTr = document.createElement('TR')
      transTr.appendChild(titleInsPaidTd)
      transTr.appendChild(titleInsPaidAnsTd)
      transTr.appendChild(transactionTypeTd)
      transTr.appendChild(transactionTypeAnsTd)
      table.appendChild(transTr)
    }

  }

  const onPDFGenerate = () => {
    generateHTML()

    // html2canvas(document.querySelector("#capture1"), {
    //     allowTaint: true,
    //     useCORS: true,

    // }).then(canvas => {
    //     document.body.appendChild(canvas)
    //     var img = canvas.toDataURL('image/png')

    //     const doc = new jsPDF('p', 'px', 'a4');

    //    // doc.text("Hello world!", 10, 10);
    //     doc.setFont('Arial')
    //    // doc.setFontSize(5)
    //     doc.addImage(img, 'PNG', 10, 10, 190, 842)
    //     doc.save("a4.pdf");
    // });
    const doc = new jsPDF('p', 'pt', 'a4', true)
    // console.log('99999',document.querySelector('#capture1') )
    //doc.getFontSize(1)
    //doc.setLineWidth(0, 5)
    doc.html(document.querySelector('#capture1'), {
      callback: function (pdf) {
        console.log('pdf-->', pdf)
        pdf.setCharSpace(.02)
        //pdf.setFontSize(2)
        pdf.save('abc.pdf')
      },
      x: 10,
      y: 20,
      // width: 500
    })
    // doc.setLineWidth(0.1)
    // // doc.html(document.querySelector('#capture1')).then(value => { doc.save('sample.pdf'); });
    // // doc.html(document.querySelector('#capture'), 20, 20, {
    // //     'width': 500
    // // })
    // doc.save('abcd.pdf')
  }


  return (
    <React.Fragment>
      <div className="container container-fluid">
        <p className='start-over-output' onClick={onStartOverClick} >{getStingOnLanguage('START_OVER')}</p>
        <button onClick={onPDFGenerate}>Generate PDF</button>
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
            <div className="row">
              <div className={className}>
                <div className="box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
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
                  <div className="box" style={{ boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}` }}>
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

    </React.Fragment>
  )
}

export default QuoteSummary
