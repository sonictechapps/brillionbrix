import React, { useEffect, useRef } from 'react'
import '../sass/stepper.scss'
import { getColor } from '../utils/utility'

const Stepper = ({ step, stepArray }) => {
    const steppeRef = useRef()
    useEffect(() => {
        let children = steppeRef.current.children
        for (let child of steppeRef.current.children) {
            child.classList.add('stepper-inactive')
            child.style.width = `${(100 / stepArray.length)}%`
            const cChild = child.children
            cChild[0].style.backgroundColor = 'grey'
            cChild[1].style.backgroundColor = 'grey'
            cChild[2].style.backgroundColor = 'grey'
        }
        for (let i = 0; i < step; i++) {
            children[i].classList.remove('stepper-inactive')
            children[i].children[1].style.backgroundColor = getColor()
            if (i >= 1) children[i].children[0].style.backgroundColor = 'green'
            if (i >= 1) children[i - 1].children[2].style.backgroundColor = 'green'
        }

    }, [step, stepArray])
    return (
        <>

            <div className="container-stepper" ref={steppeRef}>
                {
                    stepArray.map((stepperstep, index) => (
                        <div>
                            <div>
                            </div>
                            <img src={stepperstep} />
                            <div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </>
    )
}

export default Stepper