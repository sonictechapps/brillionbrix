import React from 'react'
import { Accordion, Table } from 'react-bootstrap'
import { getStingOnAPILanguage } from '../utils/utility'

const AccordionItem = ({ acordionArray }) => {
    console.log('acordionArray', acordionArray)
    const isInt = (val) => {
        return val % 1 === 0
    }

    const getAccordion = (accordion) => {
        return (
            (accordion?.total !== null && accordion?.total !== 0) ? <Accordion.Item eventKey={accordion.eventKey}>
                <Accordion.Header>{accordion.header}  <span className='total-amount'>${isInt(accordion.total) ? accordion.total : parseFloat(accordion.total).toFixed(2)}</span>
                </Accordion.Header>
                <Accordion.Body>
                    {/* <Accordion>  */}
                    {
                        accordion?.value?.length > 0 && (
                            <Table striped bordered hover>
                                <tbody>
                                    {
                                        accordion?.value?.map((obj, index) => (
                                            <>
                                                {
                                                    obj && obj?.length > 0 ? obj?.map((obj1, index1) => (
                                                        <tr key={index} >
                                                            <td style={{ width: '65%' }}>{getStingOnAPILanguage(obj1, accordion.keys[index][0])}</td>
                                                            <td className='amount'>$ {isInt(obj1[accordion.keys[index][1]]) ? obj1[accordion.keys[index][1]] : parseFloat(obj1[accordion.keys[index][1]]).toFixed(2)}</td>
                                                        </tr>

                                                    )) :
                                                    obj && !Array.isArray(obj) && accordion?.keys?.length > 0 && accordion?.keys?.map((obj1, index) => (

                                                            <tr key={index} >
                                                                <td style={{ width: '65%' }}>{getStingOnAPILanguage(obj, obj1[0])}</td>
                                                                <td className='amount'>$ {isInt(obj[obj1[1]]) ? obj[obj1[1]] : parseFloat(obj[obj1[1]]).toFixed(2)}</td>
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