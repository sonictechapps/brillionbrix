import React, { useEffect, useState } from 'react'
import { Accordion, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { PostData } from '../http/AsyncService'
import { onInputFailure, onInputSuccess } from '../redux/actioncreator/InputAction'
import { loadingData, onSummaryFailure, onSummarySuccess } from '../redux/actioncreator/SummaryAction'
import '../sass/quotesummary.scss'
import { constantValues } from '../utils/constants'
import { getColor, getStingOnLanguage, monthNames, ordinal_suffix_of, setColor, setLanguage } from '../utils/utility'
import AccordionItem from '../atomiccomponent/AccordionItem'
import ToggleButtonWithLabel from '../atomiccomponent/ToggleButtonWithLabel'
import ConfirmationModalPortal from './ConfirmationModalPortal'
import ConversationSummaryModal from './ConversationSummaryModal'
import { useNavigate, useLocation } from 'react-router'
import queryString from 'query-string'

function QuoteSummary() {
  const dispatch = useDispatch()
  const history = useNavigate()
  const location = useLocation()
  const languageId = queryString.parse(location.search).languageid
  const companyId = queryString.parse(location.search).companyid
  setLanguage(languageId)
  const { titleCompanyInfo, titleChargesQuote, recordingFee, propertyAddress, listOfEndorsements, totalSellerEstimate, selectedTransactionTypes, disclaimer, quoteCreatedOn } = location.state.data
  console.log('location-->', location.state.data)
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
  const { transactionTypeId } = selectedTransactionTypes
  const isRefinance = transactionTypeId !== undefined && (transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE || transactionTypeId === constantValues.TRANSACTION_TYPE_REFINANCE_CASH_OUT) ? true : false
  const className = isRefinance ? "col-xs-12 col-sm-12 col-md-12 col-lg-12" : "col-xs-12 col-sm-6 col-md-6 col-lg-6";

  useEffect(() => {

    let companyInfo = location.state.companyInfo.titleCompanyInfo

    if (companyInfo?.companyBGColor) {
      setColor(companyInfo.companyBGColor);
      setThemeColor(companyInfo.companyBGColor);
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
      return arr ? (arr!==null && arr[key]) ? isInt(arr[key]) ? arr[key] : arr[key].toFixed(2) : 0  : 0
    }
  }


  const filteredEndorsement = () => {
    const arr = listOfEndorsementsArr?.filter((endorse, index) => endorse.defaultEnabled)
    console.log('arr', arr)
    return arr
  }

  useEffect(() => {
    resetInsurancePremiumObj()
    setsettlementFeesObj({
      header: getStingOnLanguage('SETTLEMENT_FEES'),
      total: getTotal(titleChargesQuote.buyerEstimate.settlementFees.attorneyFees, "attorneyFee") +
        getTotal(titleChargesQuote.buyerEstimate.settlementFees.otherEscrowFees, "miscFee") +
        getTotal(titleChargesQuote.buyerEstimate.settlementFees, "closingFee"),
      eventKey: '1',
      value: [titleChargesQuote.buyerEstimate.settlementFees],
      keys: [['closingFeeDesc', 'closingFee']],
      child: [{
        header: getStingOnLanguage('OTHER_ESCROW_FEES'),
        total: getTotal(titleChargesQuote.buyerEstimate.settlementFees.otherEscrowFees, "miscFee"),
        eventKey: 's1',
        value: [titleChargesQuote.buyerEstimate.settlementFees.otherEscrowFees],
        keys: [['miscFeeName', 'miscFee']]
      },
      {
        header: getStingOnLanguage('ATTORNEY_FEES'),
        total: getTotal(titleChargesQuote.buyerEstimate.settlementFees.attorneyFees, "attorneyFee"),
        eventKey: 's2',
        value: [titleChargesQuote?.buyerEstimate?.settlementFees?.attorneyFees],
        keys: [['attorneyFeeDescription', 'attorneyFee']]
      }]
    })
    setRecordingFeesObj({
      header: getStingOnLanguage('RECORDING_FEES'),
      total: recordingFee.buyerTotalRecordingFee,
      eventKey: '2',
      value: [recordingFee.buyerRecordingFee],
      keys: [['recordingFeeDesc', 'recordingFee']]
    })
    setSellerInsurencePremierObj({
      header: getStingOnLanguage('INSURENCE_PREMIUM'),
      total: getTotal(titleChargesQuote.sellerEstimate.titleInsurances, "titleInsuranceFee"),
      eventKey: '0',
      value: [titleChargesQuote.sellerEstimate.titleInsurances],
      keys: [['titleInsuranceDescription', 'titleInsuranceFee']]
    })
    setSellerSettlementFeesObj({
      header: getStingOnLanguage('SETTLEMENT_FEES'),
      total: getTotal(titleChargesQuote.sellerEstimate.settlementFees.attorneyFees, "attorneyFee") +
        getTotal(titleChargesQuote.sellerEstimate.settlementFees.otherEscrowFees, "miscFee") +
        getTotal(titleChargesQuote.sellerEstimate.settlementFees, "closingFee"),
      eventKey: '1',
      value: [titleChargesQuote.sellerEstimate.settlementFees],
      keys: [['closingFeeDesc', 'closingFee']],
      child: [{
        header: getStingOnLanguage('OTHER_ESCROW_FEES'),
        total: getTotal(titleChargesQuote.sellerEstimate.settlementFees.otherEscrowFees, "miscFee"),
        eventKey: 's1',
        value: [titleChargesQuote.sellerEstimate.settlementFees.otherEscrowFees],
        keys: [['miscFeeName', 'miscFee']]
      },
      {
        header: getStingOnLanguage('ATTORNEY_FEES'),
        total: getTotal(titleChargesQuote.sellerEstimate.settlementFees.attorneyFees, "attorneyFee"),
        eventKey: 's2',
        value: [titleChargesQuote?.sellerEstimate?.settlementFees?.attorneyFees],
        keys: [['attorneyFeeDescription', 'attorneyFee']]
      }]
    })
    setSellerRecordingFeesObj({
      header: getStingOnLanguage('RECORDING_FEES'),
      total: recordingFee.sellerTotalRecordingFee,
      eventKey: '2',
      value: [recordingFee.sellerRecordingFee],
      keys: [['recordingFeeDesc', 'recordingFee']]
    })

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
    console.log('titleChargesQuote.buyerEstimate.titleInsurances', titleChargesQuote.buyerEstimate.titleInsurances)
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
      getTotal(titleChargesQuote.buyerEstimate.settlementFees.attorneyFees, "attorneyFee") +
      getTotal(titleChargesQuote.buyerEstimate.settlementFees.otherEscrowFees, "miscFee") +
      recordingFee.buyerTotalRecordingFee +
      getTotal(titleChargesQuote.buyerEstimate.settlementFees, "closingFee")
    return isInt(total) ? total : parseFloat(total).toFixed(2)
  }

  const getSellerTotal = () => {
    const total = getTotal(titleChargesQuote.sellerEstimate.titleInsurances, "titleInsuranceFee") +
      getTotal(titleChargesQuote.sellerEstimate.settlementFees.attorneyFees, "attorneyFee") +
      getTotal(titleChargesQuote.sellerEstimate.settlementFees.otherEscrowFees, "miscFee") +
      recordingFee.sellerTotalRecordingFee +
      getTotal(titleChargesQuote.buyerEstimate.settlementFees, "closingFee")
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
    const address = location.state.companyInfo.propertyAddress

    return `${address.streetNumber | ''} ${address.streetName || ''}, ${address.condo ? `${getStingOnLanguage('UNIT')}${address.condo}, ` : ''}${address.city}, ${address.state}, ${address.county}`
  }



  const getCreateDate = () => {
    const entireCreatedArr = quoteCreatedOn.split(" ")
    const onlyDate = entireCreatedArr[0].split('-');
    return `${ordinal_suffix_of(onlyDate[1])} ${monthNames[parseInt(onlyDate[2] - 1)]}, ${onlyDate[0]} `;
  }

  return (
    <React.Fragment>


      <div className="container container-fluid">
        <p className='start-over-output' onClick={onStartOverClick} >{getStingOnLanguage('START_OVER')}</p>
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
