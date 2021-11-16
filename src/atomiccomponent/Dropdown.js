import React, { useEffect, useState } from 'react'
import '../sass/dropdown.scss'

const Dropdown = ({ options, selectedIndex, onItemSelectedCallback, id }) => {
    console.log('id--->', id)
    let ul, span, dropdownDiv
    useEffect(() => {
        ul = document.querySelector(`#${id}`)
        console.log('op-->', ul)
        dropdownDiv = document.querySelector(`#dropdown-div-outer-${id}`)
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        console.log('span--->', span)
        if (selectedIndex)
            span.innerHTML = options[selectedIndex].name
        document.body.addEventListener('click', function (event) {
            console.log('click', event.target)
            if (ul.classList.contains('active') && (event.target.parentNode != dropdownDiv)) {
                ul.classList.remove('active')
            }
        })
    }, [])

    const onULClick = (e) => {
        ul = document.querySelector(`#${id}`)
        console.log('thht-->', ul)
        ul.classList.toggle('active')
    }

    const onItemSelectd = (event, index) => {
        event.stopPropagation()
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        span.innerHTML = options[index].name
        ul.classList.toggle('active')
        onItemSelectedCallback(index)
    }
    return (
        <>
            <div className={`dropdown-div-outer`} id={`dropdown-div-outer-${id}`} onClick={(e) => onULClick(e)}>
                <span className={`dropdown-placeholder`} id={`dropdown-placeholder-${id}`}>---</span>
                <div className={`dropdown-div-inner`} id={`dropdown-div-inner-${id}`}>
                    <ul className={`dropdown-ul`} id={id}>
                        {
                            options?.length > 0 && options.map((item, index) => (<li value={item.value} onClick={(e) => onItemSelectd(e, index)}>{item.name}</li>))
                        }
                    </ul>
                </div>
                <div className={`dropdown-hidden`} id={`dropdown-hidden-${id}`}></div>
            </div>
        </>
    )
}

export default Dropdown
