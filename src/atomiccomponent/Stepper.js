import React, { useEffect, useRef } from 'react'
import '../sass/stepper.scss'

const Stepper = ({ step }) => {
    const steppeRef = useRef()
    useEffect(() => {
        console.log('pppp', steppeRef.current.children.length)
        let children = steppeRef.current.children
        for (let child of steppeRef.current.children) {
            child.classList.remove('active')
        }
        for (let i = 0; i < step; i++) {
            children[i].classList.add('active')
        }
    }, [step])
    return (
        <>
        
            <div className="container-stepper">
                <ul className="progressbar" ref={steppeRef}>
                    <li className="active"></li>
                    <li className="active"></li>
                    <li className="active"></li>
                    <li className="active"></li>
                </ul>
            </div>
          
        </>
    )
}

export default Stepper