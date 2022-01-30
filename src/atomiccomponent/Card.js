import React from 'react'
import '../sass/card.scss'
import { getColor, setCardShadow } from '../utils/utility'

const Card = ({ iconurl, children, styles, instruction }) => {
    return (
        <div className="card-container" style={instruction ? setCardShadow() : {}}>
            {
                instruction && (
                    <div className="home-icon-container">
                        <img src={`images/avatar.png`} style={{backgroundColor: getColor()}}/>
                    </div>
                )
            }
            {
                instruction && (
                    <h2 className="labelstyle">{instruction}</h2>
                )
            }

            {children}
        </div>
    )
}

export default Card