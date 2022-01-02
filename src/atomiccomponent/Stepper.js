import React, { useEffect, useRef } from 'react'
import '../sass/stepper.scss'
import { getColor } from '../utils/utility'

const Stepper = ({ step, stepArray }) => {
    const steppeRef = useRef()
    console.log('step-->', step)
    useEffect(() => {
        for (let child of steppeRef.current.children) {
            child.classList.add('stepper-inactive')
            child.style.width = `${(100 / stepArray.length)}%`
        }

    }, [stepArray])
    return (
        <>

            <div className="container-stepper" ref={steppeRef}>
                {
                    stepArray.map((stepperstep, index) => (
                        <div >
                            {console.log('8888', step, index)}
                            <div style={step >= (index + 1) ? { backgroundColor: 'green' } : { backgroundColor: 'grey' }}>
                            </div>
                            <img src={stepperstep} style={index < step ? { backgroundColor: getColor() } : { backgroundColor: 'transparent' }} />
                            <div style={step >= (index + 2) ? { backgroundColor: 'green' } : { backgroundColor: 'grey' }}>
                            </div>
                        </div>
                    ))
                }
            </div>

        </>
    )
}

export default Stepper