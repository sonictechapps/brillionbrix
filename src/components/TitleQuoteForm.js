import React from 'react'
import Dropdown from '../atomiccomponent/Dropdown'
import EditText from '../atomiccomponent/EditText'

const TitleQuoteForm = () => {
    const options = [
        {
            value: 'volvo',
            name: 'Volvo'
        },
        {
            value: 'saab',
            name: 'Saab'
        }
    ]
    return (
        <>
            <EditText type='text' placeholder='Enter location' />
            <br />
            <Dropdown options={options} dropdoenId={'cars'} selectText="Select Text"/>
        </>
    )
}

export default TitleQuoteForm