import React, { useEffect, useRef, useState } from 'react'
import '../sass/dropdown.scss'
import { getColor } from '../utils/utility'

const Dropdown = ({ options, selectedIndex, onItemSelectedCallback, id, labelTitle }) => {
    console.log('id--->', id)
    let ul, span, dropdownDiv
    const dropDownDivOuter = useRef()
    useEffect(() => {
        ul = document.querySelector(`#${id}`)
        console.log('op-->', ul)
        dropdownDiv = document.querySelector(`#dropdown-div-outer-${id}`)
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        console.log('span--->', options[selectedIndex]?.name)
        if (selectedIndex >= 0)
            span.innerHTML = options[selectedIndex].name
        // document.body.addEventListener('click', function (event) {
        //     console.log('click', event.target)
        //     if (ul.classList.contains('active') && (event.target.parentNode != dropdownDiv)) {
        //         ul.classList.remove('active')
        //     }
        // })
    }, [])

    const onULClick = (e) => {
        ul = document.querySelector(`#${id}`)
        console.log('thht-->', ul)
        ul.classList.toggle('active')
        dropDownDivOuter.current.style.borderColor = getColor()
    }

    const onItemSelectd = (event, index) => {
        event.stopPropagation()
        // const elem = document.querySelector(`#dropdown-${id}`)
        // console.log('elem-->', elem)
        // elem.classList.add('dropdown')
        // elem.nextElementSibling.classList.add('disable-dropdown')
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        span.innerHTML = options[index].name
        ul.classList.toggle('active')
        onItemSelectedCallback(index)
        // const elemOuter = document.querySelector(`#dropdown-div-outer-${id}`)
        // elemOuter.classList.add('dropdown-div-outer-collpase')
        // ul = document.querySelector(`#${id}`)
        console.log('active--->', ul)

        if (ul.classList.contains('active')) {
            ul.classList.remove('active')
        }
    }

    const onDropdownExpand = (event) => {
        event.stopPropagation()
        console.log('event', event.target.classList.contains('disable-dropdown'))
        event.target.classList.remove('disable-dropdown')
        const elemOuter = document.querySelector(`#dropdown-div-outer-${id}`)
        elemOuter.classList.remove('dropdown-div-outer-collpase')
        const elem = document.querySelector(`#dropdown-${id}`)
        console.log('elem-->', elem)
        elem.classList.remove('dropdown')
    }



    return (
        <div style={{ position: 'relative', marginTop: '20px' }}>
            <div id={`dropdown-${id}`}>
                {labelTitle && (<div className="label-holder-dd" id={`label-holder-${id}`}><span>{labelTitle}</span></div>)}
                <div className={`dropdown-div-outer`} id={`dropdown-div-outer-${id}`} ref={dropDownDivOuter} onClick={(e) => onULClick(e)}>
                    <span className={`dropdown-placeholder`} id={`dropdown-placeholder-${id}`}>---</span>
                    <div className={`dropdown-div-inner`} id={`dropdown-div-inner-${id}`}>
                        <ul className={`dropdown-ul`} id={id}>
                            {
                                options?.length > 0 && options.map((item, index) => (<li value={item.value} onClick={(e) => onItemSelectd(e, index)}>{item.name}</li>))
                            }
                        </ul>
                    </div>
                    <div className={`dropdown-hidden`} id={`dropdown-hidden-${id}`} onClick={(e) => onDropdownExpand(e)}></div>
                </div>
            </div>
            <div></div>
        </div>
    )
}

export default Dropdown
