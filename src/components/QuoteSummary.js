import React, { useEffect, useState } from 'react'
import { Accordion, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { PostData } from '../http/AsyncService'
import { onInputFailure, onInputSuccess } from '../redux/actioncreator/InputAction'
import { loadingData, onSummaryFailure, onSummarySuccess } from '../redux/actioncreator/SummaryAction'
import '../sass/quotesummary.scss'
import { constantValues } from '../utils/constants'
import { getColor, setColor } from '../utils/utility'


function QuoteSummary() {
    const dispatch = useDispatch();

    const {titleCompanyInfo,titleChargesQuote,recordingFee, propertyAddress, listOfEndorsements, totalSellerEstimate} = useSelector(state => state?.summary?.summary);
    const [themeColor, setThemeColor] = useState("");

    useEffect(() => {
      const params = new URLSearchParams()
      params.append('companyId', '10000')

      dispatch(PostData(constantValues.BASE_URL + constantValues.INPUT_DETAILS, 'get', params, onInputSuccess,
          onInputFailure, loadingData))
  }, [])

    useEffect(() => {
      const params = new URLSearchParams()
      params.append('companyId', '10000')
    dispatch(PostData(constantValues.BASE_URL + constantValues.SUMMARY, 'get', params, onSummarySuccess,
            onSummaryFailure, loadingData));
       
    }, []);
    
    useEffect(() => {
      if(titleCompanyInfo && titleCompanyInfo.companyBGColor) {
        setColor(titleCompanyInfo.companyBGColor) ;
        setThemeColor(titleCompanyInfo.companyBGColor);
      } 
      dispatch({
          type: 'SET_COLOR',
          data: getColor()
      })
      console.log(getColor());
  }, [titleCompanyInfo])

const handleChange = (obj)=>{
  //console.log(obj);
  listOfEndorsements.forEach(data=>{
    if(obj.endorsementId == data.endorsementId){
      data.defaultEnabled = !data.defaultEnabled;
    }
  });
  console.log(listOfEndorsements);  
}

const getTotal=(arr, key)=>{
  var res = arr.reduce(function (previousValue, currentValue) {
    return previousValue + currentValue[key];
  }, 0);
  return res ;
}

return (
<React.Fragment>

  
<div className="container container-fluid ">    
  <div className="row content">
    <div className="col-sm-12"> 
    
     
         {titleCompanyInfo!=undefined
          &&  <h2 className="labelstyle">Title Quote provided by {titleCompanyInfo.companyName}. </h2>}
     
      <div>
       {propertyAddress != undefined &&   
        <p  className="question-style">{propertyAddress.streetNumber} {propertyAddress.streetName}, {propertyAddress.city}, {propertyAddress.state}, {propertyAddress.zipCode} <a href='#'>Conversation Summary</a></p>
        } 
        </div>
    <div className="row">
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <div className="box" style={{boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}`}}>
                <div className="box-icon" style={{backgroundColor: themeColor}}>
                    <span className="fa fa-4x fa-html5"><h4 className="text-center">$  
                    {titleChargesQuote != undefined &&  getTotal(titleChargesQuote.buyerEstimate.titleInsurances, "titleInsuranceFee")+
                    getTotal(titleChargesQuote.buyerEstimate.settlementFees.attorneyFees, "attorneyFee")+
                    getTotal(titleChargesQuote.buyerEstimate.settlementFees.otherEscrowFees, "miscFee")+
                    recordingFee.buyerTotalRecordingFee}</h4></span>
                </div>
                <div className="info">
                    <h4 className="text-center">Buyer</h4>
                
                    </div>  
                    {titleChargesQuote != undefined &&  
                    <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Insurance Premium  <span className='total-amount'>${ getTotal(titleChargesQuote.buyerEstimate.titleInsurances, "titleInsuranceFee")}</span>
                          
                        </Accordion.Header>
                        <Accordion.Body>
                        {/* <Accordion>  */}
                        <Table striped bordered hover>
                            
                            <tbody>
                        {titleChargesQuote.buyerEstimate.titleInsurances.map((obj,key) =>
                          <tr>
                                <td>{obj.titleInsuranceDescription}</td>
                                <td className='amount'>$ {obj.titleInsuranceFee}</td>
                              </tr>
                            )}
                            </tbody>
                         </Table> 
                           
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Sattlement Fees
                        <span className='total-amount'>
                          ${ getTotal(titleChargesQuote.buyerEstimate.settlementFees.attorneyFees, "attorneyFee")+
                          getTotal(titleChargesQuote.buyerEstimate.settlementFees.otherEscrowFees, "miscFee")
                          }
                        </span>
                        </Accordion.Header>
                        <Accordion.Body>
                        <Accordion> 
                        <Accordion.Item eventKey="s1">
                        <Accordion.Header>Other Escrow Fees  <span className='total-amount'>${ getTotal(titleChargesQuote.buyerEstimate.settlementFees.otherEscrowFees, "miscFee")}</span></Accordion.Header>
                        <Accordion.Body>
                        {/* {titleChargesQuote.buyerEstimate.settlementFees.otherEscrowFees.map((obj) =>
                            <>{obj.miscFeeName} : {obj.miscFee} <br /></> 
                            )} */}
                         <Table striped bordered hover>
                            <tbody>
                        {titleChargesQuote.buyerEstimate.settlementFees.otherEscrowFees.map((obj,key) =>
                          <tr>
                                <td>{obj.miscFeeName}</td>
                                <td className='amount'>$ {obj.miscFee}</td>
                              </tr>
                            )}
                            </tbody>
                         </Table>    
                         </Accordion.Body> 
                         </Accordion.Item>   
                         <Accordion.Item eventKey="s2">
                        <Accordion.Header>Attorney Fees<span className='total-amount'>${ getTotal(titleChargesQuote.buyerEstimate.settlementFees.attorneyFees, "attorneyFee")}</span></Accordion.Header>
                        <Accordion.Body>
                         <Table striped bordered hover>
                            <tbody>
                        {titleChargesQuote.buyerEstimate.settlementFees.attorneyFees.map((obj,key) =>
                          <tr>
                                <td>{obj.attorneyFeeDescription}</td>
                                <td className='amount'>$ {obj.attorneyFee}</td>
                              </tr>
                            )}
                            </tbody>
                         </Table>   
                         </Accordion.Body> 
                         </Accordion.Item>   
                        </Accordion> 

                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Recording Fees   <span className='total-amount'>$ {recordingFee.buyerTotalRecordingFee}</span></Accordion.Header>
                        <Accordion.Body>
                        <Accordion> 
                        <Table striped bordered hover>
                            <tbody>
                        {recordingFee.buyerRecordingFee.map((obj,key) =>
                          <tr>
                                <td>{obj.recordingFeeDesc}</td>
                                <td className='amount'>$ {obj.recordingFee}</td>
                              </tr>
                            )}
                            </tbody>
                         </Table> 
                        {/* {recordingFee.buyerRecordingFee.map((obj, key) =>
                            <>{obj.titleInsuranceDescription} : {obj.titleInsuranceFee} <br /></> 
                            <Accordion.Item eventKey={key}>
                              <Accordion.Header>{obj.recordingFeeDesc}</Accordion.Header>
                              <Accordion.Body>
                              <>{obj.recordingFeeDesc} : {obj.recordingFee} <br /></>
                              </Accordion.Body>
                          </Accordion.Item>
                          
                            )} */}
                          </Accordion>   
                        </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
                  }
                    
            </div>


        </div>
        
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <div className="box" style={{boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}`}}>
                <div className="box-icon"  style={{backgroundColor: themeColor}}>
                    <span className="fa fa-4x fa-css3">  
                    <h4 className="text-center">$ 
                    {titleChargesQuote != undefined &&  getTotal(titleChargesQuote.sellerEstimate.titleInsurances, "titleInsuranceFee")+
                    getTotal(titleChargesQuote.sellerEstimate.settlementFees.attorneyFees, "attorneyFee")+
                    getTotal(titleChargesQuote.sellerEstimate.settlementFees.otherEscrowFees, "miscFee")+
                    recordingFee.sellerTotalRecordingFee}</h4></span>
                </div>
                <div className="info">
                    <h4 className="text-center">Seller</h4>
                                     
                </div>
                {titleChargesQuote != undefined &&  
                    <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Insurance Premium <span className='total-amount'>${ getTotal(titleChargesQuote.sellerEstimate.titleInsurances, "titleInsuranceFee")}</span></Accordion.Header>
                        <Accordion.Body>
                        
                          <Table striped bordered hover>
                            
                            <tbody>
                        {titleChargesQuote.sellerEstimate.titleInsurances.map((obj,key) =>
                          <tr>
                                <td>{obj.titleInsuranceDescription}</td>
                                <td className='amount'>$ {obj.titleInsuranceFee}</td>
                              </tr>
                            )}
                            </tbody>
                         </Table> 
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Sattlement Fees
                        <span className='total-amount'>
                          ${ getTotal(titleChargesQuote.sellerEstimate.settlementFees.attorneyFees, "attorneyFee")+
                          getTotal(titleChargesQuote.sellerEstimate.settlementFees.otherEscrowFees, "miscFee")
                          }
                        </span>

                        </Accordion.Header>
                        <Accordion.Body>
                        <Accordion> 
                        <Accordion.Item eventKey="s1">
                        <Accordion.Header>Other Escrow Fees<span className='total-amount'>${ getTotal(titleChargesQuote.sellerEstimate.settlementFees.otherEscrowFees, "miscFee")}</span></Accordion.Header>
                        <Accordion.Body>
                        {/* {titleChargesQuote.sellerEstimate.settlementFees.otherEscrowFees.map((obj) =>
                            <>{obj.miscFeeName} : {obj.miscFee} <br /></> 
                            )} */}
                          <Table striped bordered hover>
                            <tbody>
                        {titleChargesQuote.sellerEstimate.settlementFees.otherEscrowFees.map((obj,key) =>
                          <tr>
                                <td>{obj.miscFeeName}</td>
                                <td className='amount'>$ {obj.miscFee}</td>
                              </tr>
                            )}
                            </tbody>
                         </Table>   
                         </Accordion.Body> 
                         </Accordion.Item>   
                         <Accordion.Item eventKey="s2">
                        <Accordion.Header>Attorney Fees<span className='total-amount'>${ getTotal(titleChargesQuote.sellerEstimate.settlementFees.attorneyFees, "attorneyFee")}</span></Accordion.Header>
                        <Accordion.Body>
                        {/* {titleChargesQuote.sellerEstimate.settlementFees.attorneyFees.map((obj) =>
                            <>{obj.attorneyFeeDescription} : {obj.attorneyFee} <br /></> 
                            )} */}
                         <Table striped bordered hover>
                            
                            <tbody>
                        {titleChargesQuote.sellerEstimate.settlementFees.attorneyFees.map((obj,key) =>
                          <tr>
                                <td>{obj.attorneyFeeDescription}</td>
                                <td className='amount'>$ {obj.attorneyFee}</td>
                              </tr>
                            )}
                            </tbody>
                         </Table>   
                         </Accordion.Body> 
                         </Accordion.Item>   
                        </Accordion> 

                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Recording Fees   <span className='total-amount'>$ {recordingFee.sellerTotalRecordingFee}</span></Accordion.Header>
                        <Accordion.Body>
                        <Accordion> 
                        {/* {recordingFee.sellerRecordingFee.map((obj, key) =>
                            // <>{obj.titleInsuranceDescription} : {obj.titleInsuranceFee} <br /></> 
                            <Accordion.Item eventKey={key}>
                              <Accordion.Header>{obj.recordingFeeDesc}</Accordion.Header>
                              <Accordion.Body>
                              <>{obj.recordingFeeDesc} : {obj.recordingFee} <br /></>
                              </Accordion.Body>
                          </Accordion.Item>
                            )} */}
                           <Table striped bordered hover>
                            <tbody>
                        {recordingFee.sellerRecordingFee.map((obj,key) =>
                          <tr>
                                <td>{obj.recordingFeeDesc}</td>
                                <td className='amount'>$ {obj.recordingFee}</td>
                              </tr>
                            )}
                            </tbody>
                         </Table>   
                          </Accordion>   
                        </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
                  }
            </div>
        </div>
        </div>
      </div>
      <div className="row">
    <div className="col-xs-12">
    <p  className="review-text">Review and request extra coverage</p>
    <p  className="review-text">Take a closure look at each of the endorsements. Some may be relavant and important for you to choose and request coverage on.</p> 
    </div>
    
    {listOfEndorsements != undefined && listOfEndorsements.map((obj) =>
          <div className="col-12 col-md-6">
          <div className="box-switch" style={{boxShadow: `0 2px 5px 0 ${themeColor}, 0 2px 10px 0 ${themeColor}`}}>
            <label> $ {obj.endorsementDescription} {obj.endorsementFee} </label>
            <label className="switch">
             <input type="checkbox"  checked={obj.defaultEnabled} onChange={()=>handleChange(obj)} />
              <span className="slider round"  style={{backgroundColor: obj.defaultEnabled?themeColor:''}}></span>
            </label>
          </div>
        </div>
    )}
   
  </div>
  </div>

  

</div>


        </React.Fragment>
    )
}

export default QuoteSummary
