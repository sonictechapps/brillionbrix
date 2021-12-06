import React from 'react'
import '../sass/card.scss'
import { setCardShadow } from '../utils/utility'

const Card = ({ iconurl, children, styles, instruction }) => {
    return (
        <div className="card-container" style={iconurl ? setCardShadow() : {}}>
            {
                iconurl && (
                    <div className="home-icon-container">
                        <img src={`${iconurl}`} />
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