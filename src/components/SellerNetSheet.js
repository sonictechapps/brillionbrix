import React, { useEffect, useState } from 'react'
import { Accordion } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { PostData } from '../http/AsyncService'
import { loadingData ,onShellerSheetFailure, onShellerSheetSuccess } from '../redux/actioncreator/ShellerSheetAction'
import '../sass/quotesummary.scss'
import { constantValues } from '../utils/constants'
import { getColor, setColor } from '../utils/utility'


function SellerNetSheet() {
    const dispatch = useDispatch();
    const [flag , setFlag] =  useState(true);
    const {titleCompanyInfo, propertyAddress, sellerEstimate, totalSellerNetProceed} = useSelector(state => state?.sellerSheet?.sellerSheet);

    useEffect(() => {
    
      const params = new URLSearchParams()
      params.append('companyId', '10000')    
    dispatch(PostData(constantValues.BASE_URL + constantValues.SELLER_NET_SHEET, 'get', params, onShellerSheetSuccess,
    onShellerSheetFailure, loadingData))             
    }, []);

    useEffect(() => {
        titleCompanyInfo && titleCompanyInfo.companyBGColor && setColor(titleCompanyInfo.companyBGColor)
        dispatch({
            type: 'SET_COLOR',
            data: getColor()
        })
    }, [titleCompanyInfo])

const handleChange = ()=>{
    setFlag(!flag);
}
return (
<React.Fragment>

  
<div className="container container-fluid ">    
  <div className="row content">
    <div className="col-sm-12"> 
    
     
         {titleCompanyInfo!=undefined
          &&  <h2 className='labelstyle'>Title Quote provided by {titleCompanyInfo.companyName}. </h2>}
     
      <div>
       {propertyAddress != undefined &&   
        <h2>{propertyAddress.streetNumber} {propertyAddress.streetName}, {propertyAddress.city}, {propertyAddress.state}, {propertyAddress.zipCode}</h2>
        } 
        </div>
    <div className="row">
              
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="box seller-box">
                <div className="box-icon"  style={{backgroundColor: ""+getColor()}}>
                    <span className="fa fa-4x fa-css3">  <h4 className="text-center">{totalSellerNetProceed}</h4></span>
                </div>
                <div className="info">
                    <h4 className="text-center">Seller</h4>
                                     
                </div>
                {sellerEstimate != undefined &&
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Title and SellementChanges</Accordion.Header>
                        <Accordion.Body>
                        {sellerEstimate.settlementFees.closingFeeDesc} : {sellerEstimate.settlementFees.closingFee}<br/>
                        {sellerEstimate.titleInsurances[0].titleInsuranceDescription} : {sellerEstimate.titleInsurances[0].titleInsuranceFee}<br/>
                        {sellerEstimate.settlementFees.otherEscrowFees[2].miscFeeName} : {sellerEstimate.settlementFees.otherEscrowFees[2].miscFee}<br/>
                        {sellerEstimate.settlementFees.attorneyFees[0].attorneyFeeDescription} : {sellerEstimate.settlementFees.attorneyFees[0].attorneyFee}<br/>
                        {sellerEstimate.settlementFees.attorneyFees[1].attorneyFeeDescription} : {sellerEstimate.settlementFees.attorneyFees[1].attorneyFee}<br/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Mortgage Payoffs</Accordion.Header>
                        <Accordion.Body>
                        {sellerEstimate.mortgagePayment.firstMortgagepaymentLabel} : {sellerEstimate.mortgagePayment.firstMortgagepaymentValue}<br/>
                        {sellerEstimate.mortgagePayment.secondMortgagepaymentLabel} : {sellerEstimate.mortgagePayment.secondMortgagepaymentValue}<br/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Real Estate Broker Commission</Accordion.Header>
                        <Accordion.Body>
                        {sellerEstimate.commission.listingAgentCommissionLabel} : {sellerEstimate.commission.listingAgentCommission}<br/>
                        {sellerEstimate.commission.buyerAgentCommissionLabel} : {sellerEstimate.commission.buyerAgentCommission}<br/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Homeowner's Association Dues</Accordion.Header>
                        <Accordion.Body>
                        {sellerEstimate.HOADue.HOADueLabel} : {sellerEstimate.HOADue.HOADue}<br/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>Prorated Property Tax</Accordion.Header>
                        <Accordion.Body>
                        {sellerEstimate.propertyTax.propertyTaxLabel} : {sellerEstimate.propertyTax.propertyTax}<br/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="5">
                        <Accordion.Header>Other Expanses or Credit</Accordion.Header>
                        <Accordion.Body>
                        {sellerEstimate.otherExpansesAndCredits.otherExpansesAndCreditsOptionList.map((obj) =>
                            <>{obj.otherExpansesAndCreditsOptionLabel} : {obj.otherExpansesAndCreditsOptionValue} <br /></> 
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
                    
                 }
            </div>
        </div>
        </div>
      </div>
     
  </div>

  

</div>


        </React.Fragment>
    )
}

export default SellerNetSheet
