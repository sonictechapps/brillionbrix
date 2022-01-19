import React from 'react'
import { Accordion, Table } from 'react-bootstrap'

const AccordionItem = ({ acordionArray }) => {

    const getAccordion = (accordion) => {
        return (
            accordion?.total !== null ? <Accordion.Item eventKey={accordion.eventKey}>
                <Accordion.Header>{accordion.header}  <span className='total-amount'>${accordion.total}</span>
                </Accordion.Header>
                <Accordion.Body>
                    {/* <Accordion>  */}
                    {
                        accordion?.child && (
                            <Accordion>
                                {
                                    accordion?.child?.map(childAcc => (
                                        getAccordion(childAcc)
                                    ))
                                }

                            </Accordion>
                        )
                    }
                    {
                        accordion?.value && (
                            <Table striped bordered hover>
                                <tbody>
                                    {
                                        accordion?.value?.map((obj, index) => (
                                            <tr key={index} >
                                                {console.log('obj', accordion.keys[0])}
                                                <td style={{ width: '85%' }}>{obj[accordion.keys[0]]}</td>
                                                <td className='amount'>$ {obj[accordion.keys[1]]}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        )
                    }
                    {/* <Table striped bordered hover>

                                <tbody>
                                    {titleChargesQuote.buyerEstimate.titleInsurances.map((obj, key) =>
                                       
                                    )}
                                </tbody>
                            </Table> */}

                </Accordion.Body>
            </Accordion.Item> : null
        )
    }
    return (
        <>
            {
                getAccordion(acordionArray)
            }
        </>

    )
}

export default AccordionItem