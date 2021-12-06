import React, { useEffect, useRef } from 'react'
import '../sass/header.scss'
import { getColor } from '../utils/utility'

const Header = () => {
    const navBarRef = useRef()
    useEffect(() => {
       // navBarRef.current.style.backgroundColor = getColor()
    }, [])
    return (
        <div className='topnav' ref={navBarRef}>
            <span className='active1'>
                BillionBrix
            </span>
            <span>Calculators</span>
            <div className="topnav-right">
                <span>Login</span>
                <span>Create your free account</span>
            </div>
        </div>
    )
}

export default Header