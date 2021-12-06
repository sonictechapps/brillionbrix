import React, { useEffect } from 'react'

const Tab = ({ name, isActive, isPopOver }) => {
    let ulElement
    let childList

    const onTabClick = (e) => {
        const liList = document.querySelectorAll('.active')
        for (let li of liList) {
            li.classList.remove('active')
        }
        for (let childNode of childList) {
            if (e.target.innerHTML === childNode.outerText) {
                e.target.parentNode.classList.add('active')
                break
            }
        }

    }

    useEffect(() => {
        ulElement = document.getElementsByTagName('UL')[0]
        childList = ulElement.childNodes        
    }, [])

    return (
        <>
            {
                isPopOver ? (<li className={isActive && 'active'} onClick={(e) => onTabClick(e)} id={name} ><a href="#news"  data-bs-toggle="popover" id="xx" data-bs-trigger="focus">{name}</a></li>)
                    : <li className={isActive && 'active'} onClick={(e) => onTabClick(e)} id={name}><a href="#news">{name}</a></li>
            }
            
            
        </>
    )
}

export default React.memo(Tab)