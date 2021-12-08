import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import '../sass/header.scss'

const Header = () => {
    const navBarRef = useRef()
    const color = useSelector(state => state.headerColor.color)
    useEffect(() => {
         navBarRef.current.style.backgroundColor = color
    }, [color])
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