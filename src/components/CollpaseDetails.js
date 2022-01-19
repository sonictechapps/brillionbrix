import React from 'react'
import '../sass/collapse.scss'

const CollapseDetails = ({ onEditClick, htmlContent, showEdit }) => {
    return (
        <div className='collapse-container'>
            <div className='collpase-data'>
                {htmlContent}
            </div>
            {
                showEdit && (
                    <div className='collpase-data-edit'>
                        <span className='edit-btn' onClick={onEditClick}>&#x270D; Edit</span>
                    </div>
                )
            }

        </div>
    )
}

export default CollapseDetails