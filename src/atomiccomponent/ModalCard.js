import React from 'react'
import '../sass/modalcard.scss'
import { getColor, setCardShadow } from '../utils/utility'

const ModalCard = ({ children}) => {
    return (
        <div className="modal-card-container" style={ setCardShadow()}>
            {children}
        </div>
    )
}

export default ModalCard