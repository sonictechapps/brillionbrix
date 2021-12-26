import React from 'react'
import '../sass/collapse.scss'

const CollapseDetails = ({ onEditClick, htmlContent }) => {

    return (
        <div className='collapse-container'>
            <div className='collpase-data'>
                {htmlContent}
            </div>
            <div className='collpase-data-edit'>
                <span className='edit-btn' onClick={onEditClick}>&#x270D; Edit</span>
            </div>
        </div>
    )
}

export default CollapseDetails