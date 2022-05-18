import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import '../sass/header.scss'

const Header = () => {
    const navBarRef = useRef()
    const { color, title, logo } = useSelector(state => state.headerColor)
    useEffect(() => {
        navBarRef.current.style.backgroundColor = color
    }, [color])

    return (
        <div className='topnav' ref={navBarRef}>
            <img src={logo} alt='logo' />
            <span className='active1'>
                {title}
            </span>
            <div className="topnav-right">

            </div>
        </div>
    )
}

export default Header

