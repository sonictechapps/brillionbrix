import React from 'react'

const CollapseDetails = ({ content, onEditClick }) => {

    return (
        <div style={{ width: '100%', fontSize: '12px', fontWeight: 'bold' }}>
            <span>{content}</span>
            <span style={{ float: 'right', cursor: 'pointer', textDecoration:'underline', color: 'blue' }} onClick={onEditClick}>&#x270D; Edit</span>
        </div>
    )
}

export default CollapseDetails