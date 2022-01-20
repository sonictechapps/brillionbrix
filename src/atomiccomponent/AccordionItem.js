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
                            <Accordion defaultActiveKey={['s1', 's2']} flush alwaysOpen>
                                {
                                    accordion?.child?.map(childAcc => (
                                        getAccordion(childAcc)
                                    ))
                                }

                            </Accordion>
                        )
                    }
                    {
                        accordion?.value?.length > 0 && (
                            <Table striped bordered hover>
                                <tbody>
                                    {
                                        accordion?.value?.map((obj, index) => (
                                            <>
                                                {
                                                    obj?.map((obj1, index1) => (
                                                        <tr key={index} >
                                                            <td style={{ width: '75%' }}>{obj1[accordion.keys[index][0]]}</td>
                                                            <td className='amount'>$ {obj1[accordion.keys[index][1]]}</td>
                                                        </tr>

                                                    ))
                                                }

                                            </>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        )
                    }

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