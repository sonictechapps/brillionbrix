import React, { useEffect, useRef } from 'react'
import '../sass/homeicon.scss'

const HomeIconComponent = ({ iconurl }) => {
    return (
        <div className="home-icon-container">
            <div className="home-icon">
                <div>
                    <img src={`${iconurl}`} />
                </div>
            </div>
        </div>
    )
}

export default HomeIconComponent