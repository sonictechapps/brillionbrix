import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import '../sass/header.scss'

import { RESET_INPUT_DATA } from '../redux/actioncreator/InputAction'


const Header = () => {
    const navBarRef = useRef()
    const dispatch = useDispatch()
    const {color, title} = useSelector(state => state.headerColor)
    useEffect(() => {
         navBarRef.current.style.backgroundColor = color
    }, [color])

    return (
        <div className='topnav' ref={navBarRef}>
            <span className='active1'>
                {title}
            </span>
            <div className="topnav-right">
            
            </div>
        </div>
    )
}

export default Header

